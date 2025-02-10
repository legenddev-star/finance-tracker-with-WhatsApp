const User = require("../models/User");
const { userRegisterValidation, userLoginValidation } = require("../services/validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { toTitleCase } = require("../utils/stringUtils");

exports.signUp = async (req, res) => {
    try {

        const { fullName, email, phone, password } = req.body;

        // Server side validation for user input during registration.
        const { error } = userRegisterValidation(req.body);
        if (error) return res.status(403).send({ error: error.details[0].message });

        // Check if email exists in Collection.
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(403).send({ error: "Email already exists." });
        
        // Check if phone number exists in Collection.
        const phoneNumberExists = await User.findOne({ phone });
        if (phoneNumberExists) return res.status(403).send({ error: "Phone number already exists." });


        // Hash incoming password with "bcryptjs".
        const salt = await bcrypt.genSalt(10); // generates a salt
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const userData = new User({
                fullName: toTitleCase(fullName),
                email: email,
                phone: phone,
                password: hashedPassword,
            });

            await userData.save();

            return res.status(201).send({ success: 'Sign up successfully. You can sign in.' })
        } catch (error) {
            return res.status(500).send({ error: error })
        }
    } catch (error) {
        // console.log("🚀 ~ file: authController.js:20 ~ exports.signUp= ~ error:", error)
        res.status(500).send({ error: "❌ Internal server error" })
    }
}



exports.signIn = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        // Server side validation for user input during login.
        const { error } = userLoginValidation(req.body);
        if (error) return res.status(403).send({ error: error.details[0].message });

        // Check if email is exists in Collection.
        const user = await User.findOne({ email });
        if (!user) return res.status(403).send({ error: "Email not found. You can register!" });

        // Check if password is correct.
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(403).send({ error: "Invalid email or password!" });

        // Generate JWT Token.
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "36h",
        });

        // console.log("GENERATED TOKEN\n", token);

        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = "";
        }

        // Set cookie.
        res.cookie(String(user._id), token, {
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 100 * 30),
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'lax',
            // secure: true,
        });

        return res.status(201).send({ success: "Signed in successfully." });
    } catch (error) {
        // console.log("🚀 ~ file: authController.js:57 ~ exports.signIn= ~ error:", error)
        res.status(500).send({ error: "❌ Internal server error" })
    }
}



exports.logout = (req, res, next) => {
    // Retrieve cookies from header.
    const cookies = req.headers.cookie;
    if (cookies) {
        const cookie = cookies.split("=")[1];
        const token = jwt.verify(cookie, process.env.JWT_SECRET, (error, user) => {
            if (error) return res.status(401).json({ error: "Invalid Token" });

            // Clear cookies from headers
            res.clearCookie(`${user._id}`);
            req.cookies[`${user._id}`] = "";

            return res.status(200).json({ message: 'Logout Successful!' });
        });
    } else {
        return res.status(401).json({ error: "No Token" });
    }
}