const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.File = require('./file')(sequelize, Sequelize);

// Relationships
db.User.hasMany(db.File, { foreignKey: 'owner_id' });
db.File.belongsTo(db.User, { foreignKey: 'owner_id' });

module.exports = db;

