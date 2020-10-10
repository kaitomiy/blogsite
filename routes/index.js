const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.redirect('/blogs');
});

// Show Signup Form
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Sign Up logic
router.post('/signup', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.render('signup');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash(
        'success',
        'Successfully Signed Up! Nice to meet you ' + req.body.username
      );
      res.redirect('/blogs');
    });
  });
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/login',
  }),
  (req, res) => {}
);

// Logout logic
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'LOGGED YOU OUT!');
  res.redirect('/blogs');
});

module.exports = router;
