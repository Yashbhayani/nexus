const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const { credentials } = require("./credentials");

dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql',
//     logging: false
//   }
// );
// 

const sequelize = new Sequelize(
  credentials.DB_NAME,
  credentials.DB_USER,
  credentials.DB_PASSWORD,
  {
    host: credentials.DB_HOST,
    port: credentials.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL Database via Sequelize'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

module.exports = sequelize;
