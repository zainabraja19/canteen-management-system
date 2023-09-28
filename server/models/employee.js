const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const employeeSchema = mongoose.Schema({
    empId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Please enter a valid email!')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    role: {
        type: String,
        enum: ["employee", "admin"],
        default: "employee",
    },
    profilePicture: {
        type: Buffer
    }
})

employeeSchema.statics.handleError = (error) => {
    console.log(error.name)
    const errors = {}

    // Handle duplicate key error
    if (error.name === "MongoServerError" && error.code === 11000) {
        const key = Object.keys(error.keyPattern)[0];
        errors[key] = `${key} already exists`
    }

    // Handle validation error
    if (error.name === "ValidationError" && error.errors) {
        Object.keys(error.errors).map(key => {
            console.log(key)
            errors[key] = error.errors[key].message
            console.log(errors)

        })
    }

    return errors
}

employeeSchema.methods.generateAuthToken = async function () {
    const emp = this
    const token = jwt.sign({ _id: emp._id.toString() }, process.env.JWT_SECRET)

    // emp.tokens = emp.tokens.concat({ token })
    // await emp.save()

    return token
}

employeeSchema.statics.findByCredentials = async (email, password) => {
    // try {
    const emp = await Employee.findOne({ email })
    if (!emp) {
        throw new Error('Incorrect username or password. Please try again!')
    }

    const isMatch = await bcrypt.compare(password, emp.password)
    if (!isMatch) {
        throw new Error('Incorrect username or password. Please try again!')
    }

    return emp
}

// Hash the plain text password before saving
employeeSchema.pre('save', async function (next) {
    const emp = this;
    const hash = await bcrypt.hash(emp.password, 10);

    this.password = hash;
    next();
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee