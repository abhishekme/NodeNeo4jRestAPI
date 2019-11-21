'use strict'

const fs = require('fs');
const path = require('path');
//const Sequelize = require('sequelize');
//const ogmneo = require('ogmneo');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const gremlinOrm = require('gremlin-orm');
//const g = new gremlinOrm('neo4j', config.host); 
//const g = new gremlinOrm(['neo4j'], '7687', 'localhost', {ssl: false, user: config.username, password: config.password});
var neo4j = require('neo4j-driver').v1;
const driver  = new neo4j.driver(config.host, neo4j.auth.basic(config.username, config.password));
var session   = driver.session();
const db      = {};

//let sequelize;
// let neo4JDriver;
// if (config.use_env_variable) {
//   //sequelize = new Sequelize(process.env[config.use_env_variable], config);
//   //neo4JDriver   = ogmneo.Connection.connect('neo4j', 'databasepass', 'localhost');
// } else {
//   //sequelize = new Sequelize(config.database, config.username, config.password, config);
//   neo4JDriver   = ogmneo.Connection.connect(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = (path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.neo4J      = session;

module.exports = db;
