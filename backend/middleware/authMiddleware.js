const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1]; // Get the part after "Bearer"

    try {
        // Use the EXACT SAME secret as auth.js
        const decoded = jwt.verify(token, "hiya_secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};