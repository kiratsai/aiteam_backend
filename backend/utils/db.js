const { Sequelize, DataTypes } = require('sequelize');

process.env.MYSQL_URI = 'mysql://aiteam:Aiteam£123456@localhost:3306/aiteam';

if (!process.env.MYSQL_URI) {
    process.env.MYSQL_URI = 'mysql://root:password@localhost:3306/defaultdb';
}

// Connect to MySQL
async function connectToDB() {
    const sequelize = new Sequelize(process.env.MYSQL_URI, {
        dialect: 'mysql'
    });

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
    })

    await sequelize.sync();
    return { sequelize, User, Redis_parameter };
}

module.exports = { connectToDB, Sequelize };