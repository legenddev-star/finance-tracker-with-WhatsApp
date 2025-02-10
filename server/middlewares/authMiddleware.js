const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {

    // Retrieve cookies from header.
    const cookies = req.headers.cookie;
    if (cookies) {
        const cookie = cookies.split("=")[1];
        const token = jwt.verify(cookie, process.env.JWT_SECRET, (error, user) => {
            if (error) return res.status(401).json({ error: "Invalid Token" });
            req.user = user._id; // Id of the user who is logged in.
            next();
        });
    } else {
        return res.status(401).json({ error: "No Token" });
    }
}

const refreshToken = async (req, res, next) => {
    try {
        // Retrieve cookies from header.
        const cookies = req.headers.cookie;
        
        if (!cookies) return res.status(403).json({ message: "Cookie not found!" });
        const previousCookie = cookies.split("=")[1];
        jwt.verify(previousCookie, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(401).json({ error: "Authentication Failed." });
            }

            // Clear cookies from headers
            res.clearCookie(`${user._id}`);
            req.cookies[`${user._id}`] = "";

            // Generate new JWT Token.
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "36h",
            });

            // Set new cookie.
            res.cookie(String(user._id), token, {
                httpOnly: true,
                path: '/',
                expires: new Date(Date.now() + 100 * 30),
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: 'lax',
                // secure: true,
            });

            req.user = user._id; // Id of the user who is logged in.
            next();
        });

    } catch (error) {
        // console.log("🚀 ~ file: authController.js:122 ~ exports.refreshToken= ~ error:", error);
    }
}

module.exports = { verifyToken, refreshToken };