var express = require('express');
var router = express.Router();

const { connectToDB, Sequelize } = require('../utils/db');
const { generateToken, isRay } = require('../utils/auth');


/* GET users listing. */
router.get('/', isRay, function (req, res, next) {
  console.log('respond with a resource')
  res.send('respond with a resource');
});

module.exports = router;
