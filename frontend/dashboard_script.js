const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the Authorization header
    const authHeader = req.headers['authorization'];
    
    // 2. Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("MiddleWare Error: No Bearer token found");
        return res.status(401).json({ msg: "Access Denied: No Token Provided" });
    }

    // 3. Extract the token part
    const token = authHeader.split(' ')[1];

    try {
        // 4. VERIFY using the EXACT same string from your auth.js routes
        // In your auth.js, you used "secret", so we use "secret" here.
        const decoded = jwt.verify(token, "secret"); 
        
        req.user = decoded; // Add user info to the request
        next();             // Let them through to the tasks!
    } catch (err) {
        console.log("JWT Error:", err.message);
        return res.status(401).json({ msg: "Session expired. Please login again." });
    }
};