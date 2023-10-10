const router = require('express').Router();
const Menu = require("../models/menu")
const Cart = require("../models/cart")
const Employee = require('../models/employee');
const Order = require('../models/orders')

// Show Menu
router.get('/menu', async (req, res) => {
    try {
        const menu = await Menu.find({})
        // console.log(menu)
        console.log(req.session)
        res.status(200).json({ data: menu })
    } catch (error) {
        res.json(500).json({ data: null, error })
    }
})

// Add to cart
// router.patch('/cart', async (req, res) => {
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
//         res.status(200).json({ cart })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error })
//     }
// })

// Remove from cart
router.patch('/cart/:id', async (req, res) => {
    // delete from cart (dec by 1)
    // recalculate cartTotal
    // update totalItems
})

// Get cart items count
router.get('/cart-count', async (req, res) => {
    try {
        const cart = await Cart.findOne({ employee: req.user.empId })
        res.status(200).json({ data: { count: cart.totalItems } })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Get employee details
router.get('/employee', async (req, res) => {
    try {
        // const emp = Employee.findById(req.user._id)
        res.status(200).json({ data: req.user })
    } catch (error) {
        res.status(500).json({ data: null, error })
    }
})

// Delete employee account
router.delete('/employee', async (req, res) => {
    try {
        const emp = await Employee.findByIdAndDelete(req.user._id);

        if (!emp) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await Cart.deleteMany({ employee: req.user._id });
        await Order.deleteMany({ orderedBy: req.user._id });

        res.status(200).json({ data: "Deleted successfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ data: null, error: err })
    }
})

// Get order detail
router.get('/order', async (req, res) => {
    try {
        const orders = await Order.findOne({ employee: req.user.empId })
            .populate("items.item")
            .exec();

        res.status(200).json({ data: orders })
    } catch (err) {
        res.status(500).json({ data: null, error: err })
    }
})

module.exports = router