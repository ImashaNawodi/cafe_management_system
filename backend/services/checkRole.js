// services/checkRole.js

module.exports.checkRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Unauthorized" });
    }
};
