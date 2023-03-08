const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const { session_token } = req.cookies;

    try {
        const data = jwt.verify(session_token, process.env.JWT_KEY);
        req.user_id = data.id;
        next();
    } catch (e) {
        res.status(401).end();
    }
}