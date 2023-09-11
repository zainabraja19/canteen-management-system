const router = require('express').Router();
const Menu = require("../models/menu")
const Cart = require("../models/cart")
const auth = require('../middleware/auth')
const { ObjectId } = require('mongodb');
const Employee = require('../models/employee');
const Order = require('../models/orders')

// Remaining orders
router.get('/', async (req, res) => {
    const orders = await Order.find({})
        .populate('employee', '-password')
        .populate('items.item')
        .exec()

    res.status(200).send({ data: orders })
})

// Add dish
router.post('/add-dish', async (req, res) => {
    const menuItem = new Menu(req.body)

    try {
        await menuItem.save()
        res.status(201).send({ data: "Added new item!" })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// Edit dish details
router.patch('/edit-dish/:id', async (req, res) => {
    try {
        // const updatedMenu = await Menu.findByIdAndUpdate(id)
    } catch (err) { }
})

// Remove dish
router.delete('/remove-dish/:id', async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);

        if (!emp) {
            return res.status(404).send({ error: 'Dish not found' });
        }

        // update the document and remove dish

        // await Cart.deleteMany({ "items.item": req.params.id });
        // await Order.deleteMany({ "items.item": req.params.id });

        res.status(200).send({ data: "Deleted item successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e })
    }
})

module.exports = router;