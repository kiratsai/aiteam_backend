const { createClient } = require('redis');

const client = createClient({
  host: 'localhost',
  port: 6379
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectToRedis() {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}
// Initialize Redis connection
connectToRedis().catch(console.error);

const setparameter1 = {
  name: "",
  parameter: "",
  async setparameter(name, parameter) {
    this.name = name;
    this.parameter = parameter;
    // Assuming 'client' is a Redis client defined elsewhere
    await client.hSet('allparameter', name, parameter);
    return `Parameter Saved ${name}: ${parameter} in Redis`;
  }
};

async function getAllParameters() {
  const allparameter = await client.hGetAll('allparameter');
  console.log('async', allparameter);
  return allparameter;
}

async function cleanAllParameters() {
  try {
    await client.del('allparameter')
    return "All parameters have been cleared from Redis.";
  } catch (error) {
    console.error("Error cleaning parameters:", error);
    throw new Error("Failed to clean parameters");
  }
}

async function cleanParameter(name) {
  try {
    await client.hDel('allparameter', name);
    return `Parameter Delete ${name} in Redis`;
  } catch (error) {
    console.error("Error the hdel:", error)
  }
}


// navigation start here
const setnavigation = {
  name: "",
  id: "",
  x: "",
  y: "",
  z: "",
  async setAnavigation(name, id, x, y, z) {
    try {
      this.name = name;
      this.id = id;
      this.x = x;
      this.y = y;
      this.z = z;
      const arr_name_id =  JSON.stringify([name, id]);
      const arr_navigation =  JSON.stringify([x, y, z]);
      await client.hSet('allnavigation', arr_name_id, arr_navigation);
      return `navigation save ${name}, ${id} : ${x} , ${y}, ${z}`;
    } catch (error) {
      console.error("set navigation error:", error);
    }
  }
}

async function getAllNavigation() {
  console.log("test function get all navigation");
  const allNavigation = await client.hGetAll('allnavigation');
  console.log('get allNavigation:', allNavigation);
  return allNavigation;
}

async function clearAllNavigaton() {
  console.log("test function clear all navigation");
  const clearAllNavigation = await client.del('allnavigation');
  console.log('clear all navigation:', clearAllNavigation );
  return clearAllNavigation;
};

async function clearNavigation(name, id){
  console.log("test function clear a navigation: name:", name," id:", id);
  try{
    const arr_a_navigation = JSON.stringify([name, id])
    const cleanANavigation = await client.hDel('allnavigation', arr_a_navigation);
    console.log('clear a navigation:', cleanANavigation);
    return cleanANavigation;
  }catch(error){
    console.log("error clear a navigation: ", error);
  }
}

async function clearNavigationTable(name) {
  console.log("test function clear table navigation: name:", name);
  try {
    const allKeys = await client.hKeys('allnavigation');
    const keysToDelete = allKeys.filter(key => {
      try {
        const [keyName, keyId] = JSON.parse(key);
        return keyName === name;
      } catch (e) {
        console.error("Error parsing key:", key, e);
        return false;
      }
    });

    console.log("keys delete", keysToDelete);

    if (keysToDelete.length === 0) {
      console.log('No matching keys found for:', name);
      return 0;
    }
    
    let totalDeleted = 0;
    for (const key of keysToDelete) {
      const deleted = await client.hDel('allnavigation', key);
      totalDeleted += deleted;
    }
    
    console.log('clean table navigation: ', totalDeleted);
    return totalDeleted;
  } catch (error) {
    console.error("Error clearing navigation table:", error);
    throw error;
  }
}


module.exports = { clearNavigationTable, clearNavigation, clearAllNavigaton, getAllNavigation, setnavigation, 
                  cleanParameter, cleanAllParameters, getAllParameters, setparameter1, 
                  client };