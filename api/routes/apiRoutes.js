'use strict'

var userController      = require('../controller/user');
var constants           = require('../../config/constants');
var middleware          = require('../../middleware/middleware');
const variableDefined   = constants[0].application;

module.exports = function(app) {

//Check Express Middleware
function isAuth(req, res, next){
    if(req.headers['userToken'] ===  undefined ){
        res.json({message: variableDefined.variables.logged_out, status:0});
    return; // return undefined
    }
    return next();  //HTTP request handlers
}

app.route('/get-user')
    .get(middleware.checkToken, userController.getData)
app.route('/change-password')
    .get(middleware.checkToken, userController.changePassword)
app.route('/create-user')
    .post(userController.validate('create'), userController.createData) 
//-------------------- AUTH Route ---------------------------------------------
app.route('/user-login')
    .post(userController.validate('login'),userController.createLogin)  
//-------------------- DO OTHER SECTION ROUTE ---------------------------------



};