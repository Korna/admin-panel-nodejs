const express = require('express');
const passport = require('passport');

const router = express.Router();

let Profile = require('../models/profile.js');

let ctr = require('../control/middleware.js');
router.get('/', ctr.isLoggedIn, function (req, res, next) {
    res.render('profile', {user: req.user});
});

router.get('/profileEdit', ctr.isLoggedIn, function (req, res, next) {

    let userId = req.user.id;

    const details = {'_id': userId};

    Profile.findOne(details, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            if (item != undefined)//item found
                res.render('profileEdit', {profile: item});
            else {
                res.render('profileEdit', {profile: new Profile()});
                // res.status(501).end();
            }

        }
    });
});

router.post('/eventDetails', function (req, res, next) {
    res.render('eventDetails.ejs', { event: req.body });
});

router.get('/contact', function (req, res, next) {
    res.render('contact.ejs', {message: req.flash('loginMessage')});
});

router.get('/about', function (req, res, next) {
    res.render('about.ejs', {message: req.flash('loginMessage')});
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

router.get('/list', ctr.isLoggedIn
    , function (req, res, next) {
        res.render('list.ejs', {message: req.flash('loginMessage')});
    });

router.get('/notes', ctr.isLoggedIn,
    function (req, res, next) {
        res.render('notes.ejs', {message: req.flash('loginMessage')});
    });

router.get('/users', ctr.isLoggedIn, ctr.requireAdmin
    , function (req, res, next) {
        res.render('users.ejs', {message: req.flash('loginMessage')});
    });

router.get('/signup', function (req, res) {
    res.render('signup.ejs', {message: req.flash('loginMessage')});
});

router.get('/profile', ctr.isLoggedIn, function (req, res) {
    res.render('profile.ejs', {user: req.user});
});

router.get('/logout', function (req, res) {
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
