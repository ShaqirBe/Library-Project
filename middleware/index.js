function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('Not authenticated');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.Role === 'admin') {
        return next();
    }
    res.status(403).send('Admin access required');
}

module.exports = { 
    isAdmin, 
    isAuthenticated 
};
