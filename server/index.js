const express = require('express')
const mongoose = require('mongoose')
const Employee = require('./models/employee')
const Admin = require('./models/admin')
const Menu = require('./models/menu')
const Order = require('./models/orders')
const passport = require('passport');
const session = require('express-session')
const { checkAuthenticated, verifyRole } = require('./middleware/auth')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/canteenDB').then(() => {
    console.log("Connected to DB!")
})

app.use(express.json())

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))

app.use(passport.initialize());
app.use(passport.session())

require('./utils/passport')
// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use(
    '/employee',
    // verifyToken,
    // verifyEmployee,
    // passport.authenticate('jwt'),
    checkAuthenticated,
    verifyRole('employee'),
    require('./routes/empRoutes')
);
app.use(
    '/admin',
    // verifyToken,
    // verifyAdmin,
    checkAuthenticated,
    verifyRole('admin'),
    require('./routes/adminRoutes')
);

// const orderedBy = new mongoose.Types.ObjectId('64f8d9e49377e7464606c2b5');
// const items = [{ item: new mongoose.Types.ObjectId('64f8d8ff63b2c799d1f4d54c'), quantity: 2 }];

// Order.findById('64f8dc834697a4685d95ce03')
//     .populate('orderedBy')
//     .populate('items.item')
//     .exec()
//     .then(order => {
//         console.log('Populated Order:', order);
//         order.items.forEach(item => {
//             console.log('Item Name:', item.item);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


app.listen(3000, () => {
    console.log("Listening on port 3000!")
})