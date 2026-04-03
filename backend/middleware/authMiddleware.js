const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // MATCHED: Uses env variable OR fallback to ensure consistency with login
        const secret = process.env.JWT_SECRET || "hiya_secret_key";
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // This allows req.user.id in your routes
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};