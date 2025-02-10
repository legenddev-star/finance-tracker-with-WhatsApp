const User = require('../models/User');
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res, next) => {
    const userId = req.user;
    const user = await User.findById(userId, "-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(201).json({ user });
}

exports.userUpdate = async (req, res, next) => {
    try {
        const { fullName, email, phone } = req.body;

        const userId = req.user;

        const user = await User.findByIdAndUpdate(userId, { fullName, email, phone }, { new: true });

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(201).json({ 'success': 'Profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: "❌ Internal server error" });
    }
}

exports.userDelete = async (req, res, next) => {
    try {
        const cookies = req.headers.cookie;
        if (cookies) {
            const cookie = cookies.split("=")[1];
            const token = jwt.verify(cookie, process.env.JWT_SECRET, async (error, user) => {
                if (error) return res.status(401).json({ error: "Invalid Token" });

                const userDelete = await User.findByIdAndDelete(user._id);

                if (!userDelete) return res.status(404).json({ error: "User not found" });

                // Clear cookies from headers
                res.clearCookie(`${user._id}`);
                req.cookies[`${user._id}`] = "";

                return res.status(201).json({ message: 'Logout Successful!' });
            });
        } else {
            return res.status(401).json({ error: "No Token" });
        }
    } catch (error) {
        return res.status(500).json({ error: "⚠： Internal server error" });
    }
}