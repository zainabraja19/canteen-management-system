const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ data: null, error: 'Please authenticate.' })
}

const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.status(401).json({ data: null, error: 'You are already logged in!' })
    }
    next()
}

const verifyRole = (role) => {
    return function (req, res, next) {
        if (req.user.role === role) {
            next();
        } else {
            res.status(400).json({ data: null, error: "You are not Authorized to view this route" })
        }
    }
}

module.exports = { checkAuthenticated, checkLoggedIn, verifyRole }
