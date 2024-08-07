
const express = require('express');
const router = express.Router();
const { connectToDB, Sequelize } = require('../utils/db');
const { cleanParameter, cleanAllParameters, getAllParameters, setparameter1, client } = require('../utils/redis');

router.post('/', async function (req, res) {
  console.log("index", req.body);
  let sequelize, Redis_parameter;
  const results = [];

  try {
    const configurations = req.body;

    if (!Array.isArray(configurations)) {
      return res.status(400).json({ message: 'Request body must be an array of configurations' });
    }

    ({ sequelize, Redis_parameter } = await connectToDB());

    // Check Database whether exiting the table
    if (!Redis_parameter) {
      Redis_parameter = defineRedisModel(sequelize);
      await Redis_parameter.sync();
    }

    for (const config of configurations) {
      const { name, parameter } = config;

      if (!name || !parameter) {
        return res.status(400).json({ message: 'Each configuration must have a name and a parameter' });
      }

      // Save name and parameter in Redis
      const redisResult = await setparameter1.setparameter(name, parameter);
      console.log(redisResult);

      // Database control update or create
      const check_exit_record = await Redis_parameter.findOne({ where: { name: name } });

      if (check_exit_record) {
        results.push({ Exit: check_exit_record.name });
        // Database update
        if (check_exit_record.parameter != parameter) {
          await Redis_parameter.update(
            { parameter: parameter },
            { where: { name: name } });
          results.push({ Update: name });
        }
      } else {
        // Database create
        const newRedisDatabase = await Redis_parameter.create({ name, parameter });
        results.push({ name: newRedisDatabase.name });
      }
    }

    res.status(201).json({ message: 'All configurations received and saved', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
});


// Change this route to GET
router.get('/get_all', async function (req, res) {
  try {
    console.log("test_001");
    const allparameter = await getAllParameters();
    console.log(allparameter);
    // Send the response back to the client
    res.json(allparameter);
  } catch (error) {
    console.error("Error fetching parameters:", error);
    res.status(500).json({ error: "Failed to fetch parameters" });
  }
});


router.post('/clean', async function (req, res) {
  let sequelize, Redis_parameter;
  try {
    const result = await cleanAllParameters();
    // res.json({ message: result });

    ({ sequelize, Redis_parameter } = await connectToDB());

    // delete the table if it exiting
    if (Redis_parameter) {
      await Redis_parameter.drop();
    }
    res.json({
      message: 'Cleanup completed successfully',
      message2: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/clean/:parameter?', async function (req, res) {
  try {
    let clean_parameter, result
    const parameterToClean = req.params.parameter;
    console.log('Parameter to Clean'. parameterToClean);

    ({sequelize, Redis_parameter} = await connectToDB());

    if (!Redis_parameter) {
      return res.status(500).json({ message: 'Failed to initialize Redis_parameter model' });
    }

    if (parameterToClean){
      //delete in redis
      result = await cleanParameter(parameterToClean);
      //delete in mysql database
      clean_parameter = await Redis_parameter.destroy({where:{ name:parameterToClean }});
    }

    res.json({ 
      message: result, 
      dbCleanup: `Deleted ${clean_parameter} record(s) for parameter: ${parameterToClean}`
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;