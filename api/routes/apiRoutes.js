'use strict'

var userController      = require('../controller/user');
var constants           = require('../../config/constants');
var middlewareAdmin     = require('../../middleware/middleware-admin');
const variableDefined   = constants[0].application;
const apiPrefix         = variableDefined.apiPrefix;

const adminPrefix       = apiPrefix + 'admin';
const sitePrefix        = apiPrefix + 'front';
module.exports = function(app) {


//ADMIN ROUTES
app.route(adminPrefix + '/get-user-list')
    .get(middlewareAdmin.checkToken, userController.getData)
app.route(adminPrefix + '/total-dashboard-count')
    .get(middlewareAdmin.checkToken, userController.getDashboardCount)
app.route(adminPrefix + '/get-award')
    .get(userController.getAwardData)
app.route(adminPrefix + '/change-password')
    .post(middlewareAdmin.checkToken, userController.validate('changePassword'), userController.changePassword)
app.route(adminPrefix + '/create-user')
    .post(userController.validate('create'), userController.createData)
//-------------------- AUTH Route -------------------------------------
app.route(adminPrefix + '/admin-login')
    .post(userController.validate('login'),userController.createLogin)  
//-------------------- DO OTHER SECTION ROUTE ------------------------

//SITE ROUTES

};