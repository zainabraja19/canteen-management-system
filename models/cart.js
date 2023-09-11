const mongoose = require('mongoose')
const moment = require('moment')

const cartSchema = mongoose.Schema({
    employee: {
        type: String,
        required: true,
        ref: "Employee"
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true
            },
            quantity: { type: Number, required: true }
        },
    ],
    totalItems: {
        type: Number,
        // required: true
    },
    cartTotal: {
        type: Number,
        // required: true
    },
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart