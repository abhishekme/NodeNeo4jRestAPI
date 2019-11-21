'use strict'


const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
//const ogmneo = require('ogmneo');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
//var { buildSchema } = require('graphql');
const DB    =   require('./');
//const theModel = new DB.OrmDriver('neo4j');
const theUserModel = DB;
// var { graphql, buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// // Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });



//console.log('Model driver: ', DB);
//var neo4j = require('neo4j-driver').v1;
//const driver = new neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "root"));
// const driver = new neo4j.driver(config.host, neo4j.auth.basic(config.username, config.password));
// var session = driver.session();

// try{
// ogmneo.Connection.connect(config.username, config.password, config.host);
// ogmneo.Connection.logCypherEnabled = true;
// }catch(err){
//     console.log('Errot: ', err);
// }

// module.exports = (theModel) => {
// const User = theModel.define('user', {  
//     // name: {
//     //   type: theModel.STRING,
//     //   required: true
//     // },
//     // age: {
//     //   type: theModel.NUMBER
//     // }
//   });
//   return User;
// }


/*exports.getQuery = function(res) {
  console.log('Welcome...');
  var dataRecord = [];
  var graphSQL = "MATCH (user:User) RETURN user.name";

  DB.neo4J 
           .run(graphSQL) 
           .then(function (result){
               //console.log('Data Record: ', result.records);

                result.records.forEach(function(record){
                   //console.log("record = ", record);
                   //console.log("result = ", result)
                   //console.log("Records",record._fields);   
                   dataRecord.push(record._fields);
                  //console.log(" 2]record._fields =", record._fields);
                   //res.json(record);                   
                   //res.status(400).json({ message: "Record", record:record });
                   //return record._fields;
               });              
               console.log("Records",dataRecord);
               return 'aaaa';;
           })      
           .catch(function(err){
            console.log("Error = " + err);
        });   
        console.log("Records 111",dataRecord);
        
        DB.neo4J.close();


  // let query = ogmneo.Query.create('Test123')
  //                            .where(new ogmneo.Where('name', { $eq: 'Kelly McGillis' }));
 
  // ogmneo.Node.find(query)
  // .then((nodes) => {
  //     //Found nodes.
  //     console.log('Found record: ', nodes);
  // }).catch((error) => {
  //     //Handle error.
  //     console.log('Error: ', error);
  // });
}*/


//module.exports = theUserModel;


// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('user', {
//       id: {
//         type: DataTypes.INTEGER(11),
//         allowNull: true,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       first_name: DataTypes.STRING,
//       password: DataTypes.STRING,
//       last_name: DataTypes.STRING,
//       email: DataTypes.STRING,
//       status: DataTypes.STRING,       
//       username: DataTypes.STRING,
//       filename: DataTypes.STRING,
//       profile_pic: DataTypes.TEXT,
      
//     },
//     {
//       freezeTableName: false, 
//     });
//  return User;  
// }
