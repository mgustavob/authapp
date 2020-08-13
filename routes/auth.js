const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig')

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body)
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) =>{
    if (created) {
      // if created, success and redirect back home
      console.log(`${user.name} was created`);
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logging in'
      })(req, res);
      // before password authenticate
      // res.redirect('/');
    } else {
      // email already exist
      console.log('email already exist');
      // flash message
      req.successFlash('email already exist. Please try again!')
      res.redirect('/auth/signup');
    }
  })
  .catch(err =>{
    console.log('Error', err);
    req.flash('Error', err )
    res.redirect('/auth/signup');

  })
  });


router.post('/login', passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect: '/auth/login',
      successFlash: 'Welcome back',
      failureFlash: 'Either email or password is incorrect, try again.'
  }));

// router.post('/login', (req, res) => {

// })

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('See you soon');
  res.redirect('/');
});



module.exports = router;
