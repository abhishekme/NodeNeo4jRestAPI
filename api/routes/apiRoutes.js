'use strict'

var userController      = require('../controller/user');
var constants           = require('../../config/constants');
var middleware          = require('../../middleware/middleware');
const variableDefined   = constants[0].application;

module.exports = function(app) {
//
app.route('/get-user')
    .get(middleware.checkToken, userController.getData)
app.route('/total-user-count')
    .get(middleware.checkToken, userController.getUserCount)
app.route('/get-award')
    .get(userController.getAwardData)
app.route('/change-password')
    .post(middleware.checkToken, userController.validate('changePassword'), userController.changePassword)
app.route('/create-user')
    .post(userController.validate('create'), userController.createData) 
//-------------------- AUTH Route ---------------------------------------------
app.route('/user-login')
    .post(userController.validate('login'),userController.createLogin)  
//-------------------- DO OTHER SECTION ROUTE ---------------------------------



};