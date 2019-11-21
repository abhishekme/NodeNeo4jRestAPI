'use strict'

const express           = require("express");
const cors              = require('cors');
const bodyParser        = require("body-parser");
var routes              = require('./api/routes/apiRoutes.js'); //importing route
const app               = express();


/*const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const models = require('./api/models')
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { models }
  })
  
  server
    .listen()
    .then(({ url }) => console.log('Server is running on localhost:4000'))
*/

//var expressGraphql = require('express-graphql');
//var { buildSchema } = require('graphql');

app.use(cors());    //Allow CORS
//Application session
//app.use(express.json());    //{ extended: false }
app.use(express.urlencoded());
// Root resolver
// var root = {
//     message: () => 'Hello World!' 
// };
// app.use('/api', expressGraphql({
//     rootValue: root,
//     graphiql: true
// }));


app.use(express.static("app/public"));  //use user upload section
routes(app);

 app.listen(8085, () => {
     console.log("App listening on port 8085");
});



