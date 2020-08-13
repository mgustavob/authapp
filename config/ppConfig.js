const localStrategy = require('passport-local').Strategy;
const db = require('../models');
const passport = require('passport');
const { deserializeUser } = require('passport');

// passport serialize your info make it easier to login - convert the user basedon the id

passport.serializeUser((user, cb) =>{
    cb(null, user.id);
})


// passport deserializeUser is going to take the id and look that upin the database
passport.deserializeUser((id, cb) => {
    cb(null, id)
    .catch(cb());
})


passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    db.user.findOne({
        where: { email }

    })
    .then(user => {
        if (!user || user.validPassword(password)){
            cb(null, false);

        } else {
            cb(null, user);
        }
    })
    .catch(cb());
}
))
