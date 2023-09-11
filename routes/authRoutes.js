const router = require('express').Router();
const Employee = require('../models/employee')
const passport = require('passport');
const auth = require('../middleware/auth')
const { checkAuthenticated, checkLoggedIn } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

router.post('/signup', checkLoggedIn, async (req, res) => {
    const employee = new Employee(req.body)

    try {
        await employee.save()
        // const token = await employee.generateAuthToken()
        res.status(201).send({ data: "Employee added successfully!" })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// router.post("/login", passport.authenticate('login', {
// successRedirect: "/dashboard",
// failureRedirect: "/login",
// }))


router.post('/login', checkLoggedIn,
    passport.authenticate(
        'login', {
        // successRedirect: "/dashboard",
        // failureRedirect: "/login",
        // failureFlash: true,
    }),
    (req, res) => {
        try {
            res.status(200).send({ data: "Login successful!" });
        } catch (e) {
            res.status(400).send({ error: e })
        }
    }
);
// async (req, res) => {
//     try {
//         // const employee = await Employee.findByCredentials(req.body.email, req.body.password)
//         const token = await employee.generateAuthToken()
//         res.send({ employee, token })
//     } catch (e) {
//         console.log(e)
//         res.status(400).send()
//     }
// }


router.get('/logout', checkAuthenticated, async (req, res) => {
    try {
        // req.employee.tokens = req.employee.tokens.filter((token) => {
        //     return token.token !== req.token
        // })
        // await req.employee.save()

        // res.send()
        console.log("here")
        req.logout(function (err) {
            if (err) { return next(err); }
            // res.redirect('/login');
            res.status(200).send({ data: "Logout successful!" })
        });
        console.log(`-------> User Logged out`)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router