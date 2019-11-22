'use strict'

const { body,validationResult } = require('express-validator');
const env                       = process.env.NODE_ENV || 'development';
const config                    = require('../../config/config.json')[env];
const constants                 = require('../../config/constants');
const variableDefined           = constants[0].application;
const theUser                   = require('../models/');
const jwt                       = require('jsonwebtoken');
const encryption                = require("../utilities/encrypt");
const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
//const theUserModel              = require('../models/userModel');

var passwordValidator           = require('password-validator');
//var uuidv1                    = require('uuid/v1') ;
var bCrypt                      = require('bcrypt');
var userController              = require('./user');
var theContr                    = userController;
var schemaPassword              = new passwordValidator();

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
    /*
    body('password')  
    .exists().withMessage(variableDefined.variables.validation_required.password_required)
    .isLength({ min: 5, max:15 }).withMessage(variableDefined.variables.validation_required.password_strength_step1)
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z][!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{5,}$/, "i").withMessage(variableDefined.variables.validation_required.password_strength_step2),
    */

    switch (method) {
      case 'create' : {
       return [ 
          body('first_name', variableDefined.variables.validation_required.first_name_required).exists(),
          body('last_name', variableDefined.variables.validation_required.last_name_required).exists(),
          body('username', variableDefined.variables.validation_required.username_required).exists(),
          body('email', variableDefined.variables.validation_required.email_required).exists().isEmail()
         ]
      }
      case 'changePassword' : {
        return [ 
           body('old_password', variableDefined.variables.validation_required.password_required).exists(),
           body('new_password', variableDefined.variables.validation_required.password_required).exists(),
           body('confirm_password', variableDefined.variables.validation_required.password_required).exists(),
          ]   
      }
      case 'login' : {
        return [ 
           body('email', variableDefined.variables.validation_required.email_required).exists().isEmail(),
           body('password', variableDefined.variables.validation_required.password_required).exists(),
          ]   
      }

      case 'update' : {
        return [ 
           body('first_name', variableDefined.variables.validation_required.first_name_required).exists(),
           body('last_name', variableDefined.variables.validation_required.last_name_required).exists(),
           body('username', variableDefined.variables.validation_required.username_required).exists(),
           body('password')  
              .exists().withMessage(variableDefined.variables.validation_required.password_required)
              .isLength({ min: 5, max:15 }).withMessage(variableDefined.variables.validation_required.password_strength_step1)
              .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,15}$/).withMessage(variableDefined.variables.validation_required.password_strength_step2),
           body('email', variableDefined.variables.validation_required.email_required).exists().isEmail()
          ]   
       }
    }
  }
  exports.apiValidation   = function(req,resp, fromSrc){
    const errors          = validationResult(req);
    var validationErr     = [];
    var validationErrMesg = [];

    //Password checking
    if(fromSrc != undefined && (fromSrc == 'create' || fromSrc == 'update' || fromSrc == 'change-password')){
        var getPassword = '';

        getPassword = req.body.password;
        if(fromSrc == 'change-password'){
            getPassword = req.body.new_password;
        }
        
        schemaPassword
            .is().min(5)
            .is().max(15)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols();
            //.is().not().oneOf(['Passw0rd', 'Password123','123456','Abc1234']);  //Blacklist password
        if(!schemaPassword.validate(getPassword)){
            validationErr.push({
                value: getPassword,
                msg: variableDefined.variables.validation_required.password_strength_step2,
                param: (fromSrc == 'change-password') ? 'new_password' : 'password',
                location: 'body'
            });
        }
    }    
    //Password checking
    errors.array().forEach(error => {
        let found = validationErr.filter(errItem => error.param === errItem.param);
        if (!found.length) {
          validationErr.push(error);
        }      
    });
    if(validationErr.length){
      validationErr.forEach(rec => {
         validationErrMesg.push({field: rec.param, message: rec.msg});
      })
      resp.status(422).json({ errors: validationErrMesg, status:0 });
      return true;
    }
    return false;
  }
//-----------------------------------------------------------------------
//-----------------API Required Field Validation ------------------------
//-----------------------******** END ********** ------------------------
//-----------------------------------------------------------------------
exports.hashPassword  = function(password){
    var saltRounds = 10;
    return bCrypt.hashSync(password, saltRounds);
}
//(DBPassword, Userpassword)
exports.validPassword = function(Userpassword, DBPassword) {
    console.log('user pass/db pass: ', theContr.hashPassword(Userpassword), " - ", DBPassword);
    return bCrypt.compareSync(DBPassword, theContr.hashPassword(Userpassword));
}

exports.createLogin  =  async(req, res) => {
    var bodyJson    = {};
    var postBody    = req.body || null;
    var findRecord  = null;
    //Add required validation
    var validReturn   = theContr.apiValidation(req, res);
    if(validReturn) return;

    if(typeof postBody === 'object'){
        bodyJson['emailParam']  = postBody.email;

        if(postBody.password != undefined && postBody.email != undefined){
            var graphMatchQL    = "MATCH (n:User) WHERE (n.email = $emailParam) RETURN n";
            try{
            await theUser.neo4J 
                .run(graphMatchQL, bodyJson) 
                .then(function (result){                    
                    findRecord = 0;
                    if(result.records != undefined && result.records.length){
                        //console.log("Exists Records", result.records[0]._fields[0] );
                        findRecord = 1;
                        var foundRec    =   {
                                                id: (result.records[0]._fields[0].identity.low), 
                                                username:result.records[0]._fields[0].properties.username,
                                                password: result.records[0]._fields[0].properties.password
                                            }
                        var dbPassword = result.records[0]._fields[0].properties.password;
                        if(encryption.decrypt(dbPassword) != postBody.password){
                            return res.status(400).json({ message: variableDefined.variables.validation_required.password_invalid, HTTP_Status:400, APP_Status : 0,record: foundRec });
                        }
                        //Found valid user and allow for login with token
                        let token = jwt.sign(
                            {
                                username: result.records[0]._fields[0].properties.username,
                                email   : postBody.email,
                                id      : result.records[0]._fields[0].identity.low       
                            },
                            config.jwtTokenKey,
                            {
                                expiresIn: 60000
                            }
                        );              
                        return res.status(200).json({ message: variableDefined.variables.login_success, HTTP_Status:200, APP_Status:1, record: foundRec, authToken: token});
                    }else{
                        return res.status(400).json({ message: variableDefined.variables.validation_required.email_not_exists, HTTP_Status:400, APP_Status:0, record: []});    
                    }                
                });
            }
            catch(err){
                return res.status(400).json({ message: variableDefined.variables.unhandledError, HTTP_Status:400, APP_Status:0, error: err});
            }
            finally{
                //Do the needful
            };
        }
    }
}

exports.changePassword  = async(req, res) => {
    var bodyJson    = {};
    var postBody    = req.body || null;
    var findRecord  = null;
    //Add required validation
    var validReturn = theContr.apiValidation(req, res, 'change-password');
    if(validReturn) return;
    
    let token       = req.headers['authorization'];
    let userRecord  = {};   let foundRec = {};
    if(typeof postBody === 'object'){
        if(postBody.new_password != postBody.confirm_password){
            return res.status(409).json({ message: variableDefined.variables.validation_required.password_match, status:0, HTTP_Status:409});
        }
        await jwt.verify(token, config.jwtTokenKey, (err, decoded) => {
            userRecord  =   decoded;
        });
        //Get Record By Email
        bodyJson['emailParam']          = userRecord.email;
        var graphMatchQL    = "MATCH (n:User) WHERE (n.email = $emailParam) RETURN n";
        try{
        await theUser.neo4J 
            .run(graphMatchQL, bodyJson)
            .then(function (result){
                if(result.records != undefined && result.records.length){
                    //console.log("Exists Records", result.records[0]._fields[0] );
                    foundRec    =   result.records[0]._fields[0];
                }                
            });
        }
        finally{
            //Do the needful
        };
        if(typeof foundRec === 'object' && foundRec != null){
            //console.log('Found Record: ', foundRec);
            var DBPassword = foundRec.properties.password;
            foundRec    =   {
                id: foundRec.identity.low, 
                username:foundRec.properties.username,
                email:foundRec.properties.email 
            }            
            var UserNewPassword    =  encryption.encrypt(postBody.new_password);
            var UserOldPassword    =  encryption.encrypt(postBody.old_password);
            //console.log('Oldpassword ',UserOldPassword," :: ", UserNewPassword);
            //console.log("new password " , " :: ", UserNewPassword , " Decrypt ", encryption.decrypt(DBPassword));
            
            if(postBody.old_password == postBody.new_password){
                return res.status(400).json({ message: variableDefined.variables.validation_required.password_equal, HTTP_Status:400, APP_Status : 0,record: foundRec });                
            }
            if(encryption.decrypt(DBPassword) != postBody.old_password){
                return res.status(400).json({ message: variableDefined.variables.validation_required.password_invalid, HTTP_Status:400, APP_Status : 0,record: foundRec });
            }
            //Update DB Password with New Password
            bodyJson['passwordParam']  = UserNewPassword;
            var graphUpdateQL    = "MATCH (n:User { email : $emailParam }) SET n.password = $passwordParam RETURN n";
            try{
            await theUser.neo4J 
                .run(graphUpdateQL, bodyJson) 
                .then(function (result){                
                    //console.log('Update Password: ', result.records[0]._fields[0]);
                    foundRec = result.records[0]._fields[0].properties;
                    return res.status(400).json({ message: variableDefined.variables.validation_required.password_update, HTTP_Status:200, APP_Status : 0,record: foundRec });
                });
            }
            finally{
                //Do the needful
            };

        } 

    }
}

exports.getData     =  function(req, res){
    var dataRecord  = [];
    var graphQL    = "MATCH (n:User) RETURN n LIMIT 25";

    theUser.neo4J 
           .run(graphQL) 
           .then(function (result){
                result.records.forEach(function(record){
                    //console.log(record._fields[0]);
                    if(record._fields[0].identity.low > 0){
                     record._fields[0].properties['id']  = record._fields[0].identity.low;  
                    }   
                   dataRecord.push(record._fields[0].properties);
               });              
               return res.status(400).json({ message: variableDefined.variables.listing_record, status:1, record:dataRecord });
           })      
           .catch(function(err){
            return res.status(400).json({ message: variableDefined.variables.unhandledError, status:0, error:err });
        });           
        theUser.neo4J.close();
}
exports.createData  =  async(req, res) => {
    var bodyJson    = {};
    var postBody    = req.body || null;
    var findRecord  = null;
    //Add required validation
    var validReturn   = theContr.apiValidation(req, res, 'create');
    if(validReturn) return;

    if(typeof postBody === 'object'){
        if(postBody.password != undefined){
            var hashPassword = theContr.hashPassword(postBody.password);
            if(hashPassword) postBody.password = hashPassword;
         }
        
        //bodyJson['idParam']             = uuidv1(); 
        bodyJson['firstNameParam']      = req.body.first_name;
        bodyJson['lastNameParam']       = req.body.last_name;
        bodyJson['nameParam']           = req.body.first_name + ' ' + req.body.last_name;
        bodyJson['emailParam']          = req.body.email;
        bodyJson['passwordParam']       = req.body.password;
        bodyJson['usernameParam']       = req.body.username;

        var graphMatchQL    = "MATCH (n:User) WHERE (n.email = $emailParam OR n.username = $usernameParam) RETURN n";
        try{
        await theUser.neo4J 
            .run(graphMatchQL, bodyJson) 
            .then(function (result){
                
                findRecord = 0;
                if(result.records != undefined && result.records.length){
                    console.log("Exists Records", result.records[0]._fields[0] );
                    findRecord = 1;
                    var foundRec    =   {
                                            id: (result.records[0]._fields[0].identity.low), 
                                            username:result.records[0]._fields[0].properties.username 
                                        }
                    return res.status(409).json({ message: variableDefined.variables.record_exists, status:0, HTTP_Status:409, record: foundRec});
                }                
            });
        }
        finally{
            //Do the needful
        };
    }
    //,email:{email}, password:{password}
    //bodyJson['nameParam']   =   nameParam;
    //bodyJson['email']       =   'suman.sahoo@navsoft.in';
    //bodyJson['password']    =   'Suman!1985';
    //CREATE (n:User {name:'Kaustav-navsoft'})
    //.run(graphQL, bodyJson ) 
    //.run('CREATE (n:User {name: {nameParam}})', { nameParam: nameParam })     //Run

    if(findRecord != null && !findRecord){
        var graphQL    = "CREATE ( n:User { name:$nameParam, first_name: $firstNameParam, last_name: $lastNameParam,username: $usernameParam, email: $emailParam,password: $passwordParam })";
        theUser.neo4J
            .run(graphQL, bodyJson)           
            .then(function (result){                            
               console.log("Insert Record", result);
                return res.status(400).json({ message: variableDefined.variables.insert_record, status:1, record:result.summary });
           })
           .catch(function(err){
                return res.status(400).json({ message: variableDefined.variables.unhandledError, status:0, error:err });
        });
    }               
    theUser.neo4J.close();
}
