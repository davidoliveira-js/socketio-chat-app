const { Connection } = require('pg');
const Sequelize = require('sequelize');
const dbCOnfig = require('../config/process.js');
require('dotenv').config();
const { NODE_ENV } = process.env;

const User = require('../models/User');

if (NODE_ENV.trim() == 'development') {
  var connection = new Sequelize(dbCOnfig.development);
} else {
  var connection = new Sequelize(
    process.env.DATABASE_URL,
    dbCOnfig.production
  );
}

User.init(connection);

module.exports = connection;
