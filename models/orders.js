const mongoose = require('mongoose')
const moment = require('moment')

const orderSchema = mongoose.Schema({
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
    totalAmount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        // required: true
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ['online', 'cod'],
    },
    orderDate: {
        type: Date,
        default: moment.now()
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order