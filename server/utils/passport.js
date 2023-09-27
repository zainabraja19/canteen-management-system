const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Employee = require('../models/employee')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                console.log("in passport")
                await Employee.findByCredentials(email, password).then(data => console.log("d", data)).catch(err => console.log("e", err))
                const employee = await Employee.findByCredentials(email, password)
                console.log("18", employee)
                if (!employee) {
                    return done(null, false, { message: 'Unable to login. Please try again!' });
                }

                const emp = { ...employee.toObject() };
                delete emp.password;
                delete emp.__v
                console.log("emp", employee)

                return done(null, emp, { message: 'Logged in Successfully' });
            } catch (error) {
                // console.log(error)
                return done(error.message);
            }
        }
    )
);

// passport.use(
//     new JWTstrategy(
//         {
//             secretOrKey: 'TOP_SECRET',
//             jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
//         },
//         async (token, done) => {
//             try {
//                 console.log("in", token)
//                 return done(null, token.emp);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

passport.serializeUser((empObj, done) => {
    console.log("-----Serialize-----")
    console.log(empObj)
    done(null, empObj)
})

passport.deserializeUser((empObj, done) => {
    console.log("-----Deserialize-----")
    console.log(empObj)
    done(null, empObj)
})

// passport.serializeUser((user, done) => {
//     console.log(`--------> Serialize User`)
//     console.log(user.empId)

//     done(null, user)
// })


// passport.deserializeUser((id, done) => {
//     console.log("---------> Deserialize Id")
//     console.log(id)

//     done(null, { name: "Kyle", id: 123 })
// })

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     Employee.findById(id, function (err, user) {
//         done(err, user);
//     });
// });