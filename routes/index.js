const express = require('express');
const passport = require('passport');
const router = express.Router();


let ctr = require('../control/middleware.js');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/list', ctr.isLoggedIn
    , function(req, res, next) {
    res.render('list.ejs', { message: req.flash('loginMessage') });
});

router.get('/notes', ctr.isLoggedIn, ctr.requireAdmin
    , function(req, res, next) {
    res.render('notes.ejs', { message: req.flash('loginMessage') });
});

router.get('/users', ctr.isLoggedIn, ctr.requireAdmin
    , function(req, res, next) {
    res.render('users.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', ctr.isLoggedIn, function(req, res) {
  let email = req.user;
 // console.log(req.user);
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;
