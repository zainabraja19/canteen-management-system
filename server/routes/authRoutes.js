const router = require('express').Router();
const Employee = require('../models/employee')
const passport = require('passport');
const auth = require('../middleware/auth')
const { checkAuthenticated, checkLoggedIn } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

router.post('/signup', checkLoggedIn, async (req, res) => {
    const employee = new Employee(req.body)
    // HANDLE SIGNUP VALIDATIONS PROPERLY
    try {
        await employee.save()
        res.status(201).json({ data: "Employee added successfully!" })
    } catch (e) {
        console.log(e)
        res.status(400).json({ data: null, error: e })
    }
})


router.post('/login', checkLoggedIn,
    passport.authenticate(
        'login', {
        failureFlash: true
    }),
    (req, res) => {
        try {
            // console.log("req", req.user)
            // res.cookie('userid', req.user.id, { maxAge: 3 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ data: req.user });
        } catch (e) {
            console.log("login", e)
            res.status(400).json({ data: null, error: e })
        }
    }
);


router.get('/logout', checkAuthenticated, async (req, res) => {
    try {
        console.log("here")
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