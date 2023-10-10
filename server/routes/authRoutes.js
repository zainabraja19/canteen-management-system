const router = require('express').Router();
const Employee = require('../models/employee')
const passport = require('passport');
const auth = require('../middleware/auth')
const { checkAuthenticated, checkLoggedIn } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

// User registration
router.post('/signup', checkLoggedIn, async (req, res) => {
    const employee = new Employee(req.body)
    try {
        await employee.save()

        const emp = { ...employee.toObject() };

        delete emp.password;
        delete emp.__v

        res.status(201).json({ data: emp })
    } catch (e) {
        const error = Employee.handleError(e)
        res.status(400).json({ data: null, error })
    }
})

// User login
router.post('/login', checkLoggedIn,
    passport.authenticate(
        'login', {
    }),
    (req, res) => {
        try {
            // console.log("req", req.user)
            // res.cookie('userid', req.user.id, { maxAge: 3 * 24 * 60 * 60 * 1000 });
            req.user.expiresIn = req.session.cookie._expires
            res.status(200).json({ data: req.user });
        } catch (e) {
            res.status(400).json({ data: null, error: e })
        }
    }
);

// User logout
router.get('/logout', checkAuthenticated, async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.clearCookie('connect.sid');
            res.status(200).json({ data: "Logout successful!" })
        });

        console.log(`-------> User Logged out`)
    } catch (e) {
        res.status(500).json({ data: null, error: e })
    }
})

module.exports = router