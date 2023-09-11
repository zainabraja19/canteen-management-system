const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    isAvailable: {
        type: Boolean,
    },
    image: {
        type: Buffer,
    },
    onlyForToday: {
        type: Boolean,
        required: true
    }
})

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu