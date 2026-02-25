var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt = require('bcryptjs');
var db = require("../models");
var UserService = require("../services/usersService");
var userService = new UserService(db);

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
      const data = await userService.getOneByName(username);
      if (!data) {
          return cb(null, false, { message: 'Incorrect username or password.' });
      }

      const passwordMatches = await bcrypt.compare(password, data.Password);
      if (!passwordMatches) {
          return cb(null, false, { message: 'Incorrect username or password.' });
      }

      return cb(null, data);
  } catch (error) {
      return cb(error);
  }
}));


passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.Username, role: user.Role });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    userService.getOne(user.id)
    .then((fullUser) => {
      cb(null, fullUser);
    })
    .catch(err => cb(err));
  });
});

var router = express.Router();
router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user });
}); 

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { user: req.user });
});

router.post('/signup', function(req, res, next) {
  userService.create(req.body.firstname, req.body.lastname, req.body.username, req.body.password)
      .then(() => res.redirect('/login'))
      .catch(err => next(err));
});


module.exports = router;
