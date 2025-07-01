const { Sequelize, DataTypes } = require('sequelize');

// Use environment variables, with fallbacks if not provided
const dbUri = process.env.mysql || 'mysql://aiteam:Aiteam£123456@mysql-service:3306/aiteam';

console.log('Attempting to connect to database with URI:', dbUri.replace(/:[^:]*@/, ':****@')); // Log URI without password

// Connect to MySQL with retry mechanism
async function connectToDB(maxRetries = 10, retryDelay = 5000) {
    let retries = 0;
    let lastError;

    while (retries < maxRetries) {
        try {
            console.log(`Connection attempt ${retries + 1}/${maxRetries}`);
            
            const sequelize = new Sequelize(dbUri, {
                dialect: 'mysql',
                logging: console.log,
                dialectOptions: {
                    connectTimeout: 30000 // Increase connection timeout
                },
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });

            // Test connection
            await sequelize.authenticate();
            console.log('Database connection established successfully!');

            // Define User model
            const User = sequelize.define('user-rs', {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                ip_address: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                permission: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    get() {
                        const rawValue = this.getDataValue('permission');
                        return rawValue ? JSON.parse(rawValue) : [];
                    },
                    set(value) {
                        this.setDataValue('permission', JSON.stringify(value));
                    }
                }
            }, {
                timestamps: true  // Sequelize will automatically handle createdAt and updatedAt
            });

            const Redis_parameter = sequelize.define('redis-parameter', {
                name: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    allowNull: false
                },
                parameter: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            }, {
                timestamps: true  // Sequelize will automatically handle createdAt and updatedAt
            });

            // Synchronize models with database
            await sequelize.sync();
            console.log('Models synchronized with database');
            
            return { sequelize, User, Redis_parameter };
        } catch (error) {
            lastError = error;
            retries++;
            console.error(`Database connection attempt ${retries} failed:`, error.message);
            
            if (retries >= maxRetries) {
                console.error('Max retries reached. Could not connect to database.');
                throw error;
            }
            
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    
    throw lastError;
}

module.exports = { connectToDB, Sequelize };