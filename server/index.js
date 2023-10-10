const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const passport = require('passport');
const session = require('express-session')
const { checkAuthenticated, verifyRole } = require('./middleware/auth')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/canteenDB').then(() => {
    console.log("Connected to DB!")
})

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));

app.use(express.json())

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3 * 60 * 60 * 1000 } // 1 hour
}))

app.use(passport.initialize());
app.use(passport.session())

require('./utils/passport')
// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use(
    '/employee',
    checkAuthenticated,
    verifyRole('employee'),
    require('./routes/empRoutes')
);
app.use(
    '/admin',
    checkAuthenticated,
    verifyRole('admin'),
    require('./routes/adminRoutes')
);

// Error handler
app.use((err, req, res, next) => {
    if (err.message) {
        return res.status(401).json({ data: null, error: err.message });
    }

    return res.status(500).json({ data: null, error: 'Internal Server Error' });
});

app.listen(3000, () => {
    console.log("Listening on port 3000!")
})