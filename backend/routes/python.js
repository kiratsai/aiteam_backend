var express = require('express');
var router = express.Router();
const { connectToDB, Sequelize } = require('../utils/db');
const { generateToken } = require('../utils/auth');

router.all('/open/up', async function (req, res) {
  var spawn = require("child_process").spawn;

  try {
    var process = spawn('python3', ["/home/aiteam/Desktop/action.py", "--slider_up", "1"]);

    let output = '';

    //start the python
    process.stdout.on('data', function (data) {
      output += data.toString();
    });

    process.on('close', (code) => {
      res.send(output || "robot-running");
    });

    process.on('error', (error) => {
      console.error(`Process error: ${error}`);
      res.status(500).send("Error executing script");
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred");
  }
});

router.all('/open/down', async function (req, res) {
  var spawn = require("child_process").spawn;

  try {
    var process = spawn('python3', ["/home/aiteam/Desktop/action.py", "--slider_down", "1"]);

    let output = '';

    //start the python
    process.stdout.on('data', function (data) {
      output += data.toString();
    });

    process.on('close', (code) => {
      res.send(output || "robot-running");
    });

    process.on('error', (error) => {
      console.error(`Process error: ${error}`);
      res.status(500).send("Error executing script");
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred");
  }
});

router.all('/stop', async function (req, res) {
  const { spawn } = require("child_process");

  try {
    let output = 'STOP!!!';
    const process = spawn('python3', [
      "/home/aiteam/Desktop/action.py",
      "--slider_down", "0",
    ]);

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        res.send(output);
      } else {
        res.status(500).send(`Process exited with code ${code}`);
      }
    });

    process.on('error', (error) => {
      console.error(`Process error: ${error}`);
      res.status(500).send("Error executing script");
    });

  } catch (error) {
    console.error(`Error stopping process: ${error}`);
    res.status(500).send("Error stopping process");
  }
});

module.exports = router;