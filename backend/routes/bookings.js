var express = require('express');
var router = express.Router();
var passport = require('passport');

const { connectToDB, Sequelize } = require('../utils/db');
const { generateToken } = require('../utils/auth');


module.exports = router;