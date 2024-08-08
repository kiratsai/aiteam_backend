var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;
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


// navigation test part:
let streamProcess = null;

router.get('/stream-data/:id?', (req, res) => {
  const id = req.params.id;

  if (id === "start") {
    if (streamProcess) {
      return res.status(400).send("Stream is already running");
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    streamProcess = spawn('python3', ['/home/aiteam/Desktop/action2.py']);

    streamProcess.stdout.on('data', (data) => {
      const streaming = data.toString().trim();
      res.write(`event: streaming\ndata: ${streaming}\n\n`);
      console.log(streaming);
    });

    streamProcess.on('close', (code) => {
      console.log(`Python process closed with code ${code}`);
      streamProcess = null;
      res.end();
    });

    streamProcess.on('error', (error) => {
      console.error(`Process error: ${error}`);
      streamProcess = null;
      res.status(500).send("Error executing script");
    });

    req.on('close', () => {
      if (streamProcess) {
        streamProcess.kill();
        streamProcess = null;
      }
    });

  } else if (id === "stop") {
    streamProcess.kill();
    streamProcess = null;
    res.status(200).send("Stream stopped successfully");

  }
});

module.exports = router;