var express = require('express');
var router = express.Router();
const { connectToDB, Sequelize } = require('../utils/db');
const { generateToken } = require('../utils/auth');

/* Handle the Form */
router.post('/api/login', async (req, res) => {
  let sequelize, User;
  try {
    // Connect to the database and get the User model
    ({ sequelize, User } = await connectToDB());

    console.log("email: " + req.body.email);
    console.log("password: " + req.body.password)

    // Retrieve one user
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    } else if (req.body.password === user.password) {
      console.log("password match!!!");
    } else {
      console.log("wrong email or password!!!");
      return;
    }

    // Convert Sequelize model to plain JavaScript object
    let userObject = user.get({ plain: true });

    // Delete sensitive information
    delete userObject.password;
    delete userObject.ip_address;

    // generate a JWT token
    const token = generateToken(userObject);

    // return the token
    res.json({ token: token });

    // Log to verify deletion (this should show 'undefined')
    console.log("password: " + userObject.password);
    console.log("ip_address: " + userObject.ip_address);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
});


router.post('/api/registration', async function (req, res) {
  let sequelize, User;
  try {
    // Connect to the database and get the User model
    ({ sequelize, User } = await connectToDB());
    if (!User) {
      User = defineUserrsModel(sequelize);
      await User.sync(); // Ensure the table exists
    }
    // console.log(req.body.name)
    // Process the request body
    req.body.email = req.body.email;
    req.body.name = req.body.name;
    req.body.password = req.body.password;
    req.body.permssion = JSON.stringify(req.body.permission);
    req.body.createdAt = new Date();
    req.body.modifiedAt = new Date();

    // Create the User
    const newUser = await User.create(req.body);

    res.status(201).json({ id: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
});
module.exports = router;