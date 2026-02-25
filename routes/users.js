var express = require('express');
var router = express.Router();
var jsonParser = express.json();
var db = require("../models");
var UserService = require("../services/usersService")
var userService = new UserService(db);


/* GET users listing. */
router.get('/:userId', async function(req, res, next) {
  try {
    const user = await userService.getOne(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('userDetails', { user, currentUser: req.user });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
