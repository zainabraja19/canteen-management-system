const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: Buffer
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin