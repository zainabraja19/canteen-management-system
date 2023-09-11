const router = require('express').Router();
const Employee = require('../models/employee')

router.get('/getUsers', (req, res) => {
    Employee.find({})
        .then(data => {
            console.log(data)
            res.status(200).send(data)
        })
        .catch(err => {
            console.log(err)
            res.send()
        })
})

module.exports = router