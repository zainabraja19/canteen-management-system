const router = require('express').Router();
const Menu = require("../models/menu")
const Cart = require("../models/cart")
const auth = require('../middleware/auth')
const { ObjectId } = require('mongodb');
const Employee = require('../models/employee');
const Order = require('../models/orders')

// Show Menu
router.get('/', async (req, res) => {
    try {
        const menu = await Menu.find({})
        // console.log(menu)
        console.log(req.session)
        res.status(200).send({ data: menu })
    } catch (error) {
        res.send(500).send({ error })
    }
})

// Add to cart
// router.patch('/add-to-cart', async (req, res) => {
//     try {
//         const employee = req.user.empId
//         let cart = await Cart.findOne({ employee })

//         console.log(cart)
//         // if (!cart) {
//         //     cart = new Cart({ employee })
//         // } else {
//         //     const filter = { employee }
//         //     const update = {
//         //         $set: { 'items.$[elem].item': req.body.itemId },
//         //         $inc: { 'items.$[elem].quantity': 1 }
//         //     }
//         //     const options = {
//         //         upsert: true,
//         //         arrayFilters: [{ 'elem.item': req.body.itemId }] // Filter to identify the specific item to update
//         //     };
//         //     console.log(filter, update, options)
//         //     cart = await Cart.findOneAndUpdate(filter, update, options);
//         // }
//         if (!cart) {
//             cart = new Cart({ employee });
//             await cart.save(); // Save the newly created cart to the database
//         } else {
//             // let cartTotal = 0;

//             // for (const item of cart.items) {
//             //     const menu = await mongoose.model('Menu').findById(item.item);

//             //     if (menu) {
//             //         cartTotal += menu.price * item.quantity;
//             //     }
//             // }

//             // // Set the calculated total in the cart document
//             // cart.cartTotal = cartTotal;

//             const filter = { employee };
//             const update = {
//                 $set: { 'items.$[elem].item': req.body.itemId },
//                 $inc: { 'items.$[elem].quantity': 1 }
//             };
//             const options = {
//                 upsert: true,
//                 arrayFilters: [{ 'elem.item': req.body.itemId }] // Filter to identify the specific item to update
//             };

//             console.log(filter, update, options);
//             cart = await Cart.findOneAndUpdate(filter, update, options);
//         }
//         res.status(200).send({ cart })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ error })
//     }
// })

router.patch('/delete-from-cart/:id', async (req, res) => {
    // delete from cart (dec by 1)
    // recalculate cartTotal
    // update totalItems
})

router.get('/cart-count', async (req, res) => {
    try {
        const cart = await Cart.findOne({ employee: req.user.empId })
        res.status(200).send({ data: { count: cart.totalItems } })
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.get('/profile', async (req, res) => {
    try {
        // const emp = Employee.findById(req.user._id)
        res.status(200).send({ data: req.user })
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.delete('/delete-account', async (req, res) => {
    try {
        const emp = await Employee.findByIdAndDelete(req.user._id);

        if (!emp) {
            return res.status(404).send({ error: 'Employee not found' });
        }

        await Cart.deleteMany({ employee: req.user._id });
        await Order.deleteMany({ orderedBy: req.user._id });

        res.status(200).send({ data: "Deleted successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/order-history', async (req, res) => {
    try {
        const orders = await Order.findOne({ employee: req.user.empId })
            .populate("items.item")
            .exec();

        res.status(200).send({ data: orders })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router