const express = require('express');
const router = express.Router();
const { connectToDB, Sequelize } = require('../utils/db');
const { setnavigation, getAllNavigation, clearAllNavigaton, clearNavigation, client } = require('../utils/redis');

router.post('/', async function (req,res){
    console.log("navigation req", req.body);
    const results = [];

    try{
        const navigation_parameter = req.body;
        const {name,id,x,y,z} = navigation_parameter;
        const redisResult = await setnavigation.setAnavigation(name, id, x, y, z);
        console.log(redisResult);

    }catch(error){
        console.log("navigation.js/ error:", error);
    }

});

router.get('/getAllNavigation', async function (req,res){
    console.log("get All Navigation: ");
    try{    
    const allNavigation = await getAllNavigation();
    console.log("all Navigation", allNavigation);
    res.json(allNavigation);
    }catch(error){
    console.log("get navigation error:" , error);
    }
})

router.post('/cleanAllNavigation', async function (req, res){
    console.log("clean a Navigation");
    try{
        const clearAll = await clearAllNavigaton();
        console.log("clear all Navigation:", clearAll)
        res.json(clearAll);
    }catch(error){
        console.log("clean navigation error:", error);
    }
});

router.post('/cleanANavigation/:name?/:id?', async function (req, res){
    console.log("clean a Navigation");
    try{
        const name = req.params.name;
        const id = req.params.id;
        console.log(name, id)
        const clearNav = await clearNavigation(name, id);
        console.log("clear all Navigation:", clearNav)
        res.json({
            message: clearNav, 
            message1 : 'Clean the navigation completed successfully',});
    }catch(error){
        console.log("clean navigation error:", error);
    }
});

module.exports = router;