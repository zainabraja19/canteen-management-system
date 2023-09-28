const jwt = require('jsonwebtoken')
const Employee = require('../models/employee')

// const verifyToken = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await Employee.findOne({ _id: decoded._id, 'tokens.token': token })

//         if (!user) {
//             throw new Error()
//         }

//         req.token = token
//         req.user = user
//         next()
//     } catch (e) {
//         res.status(401).json({ error: 'Please authenticate.' })
//     }
// }

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("in")
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
            // req.flash('warning', 'you are not Authorized to see this route');
            // res.redirect('/auth/login');
        }
    }
}

module.exports = { checkAuthenticated, checkLoggedIn, verifyRole }