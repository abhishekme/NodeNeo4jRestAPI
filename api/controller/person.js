'use strict'

const { body,validationResult } = require('express-validator');
const env                       = process.env.NODE_ENV || 'development';
const config                    = require('../../config/config.json')[env];
const constants                 = require('../../config/constants');
const variableDefined           = constants[0].application;
const thePerson                 = require('../models/');
var personController            = require('./person');
var theContr                    = personController;

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {    
    switch (method) {
      case 'create' : {
       return [ 
          body('first_name', variableDefined.variables.validation_required.first_name_required).exists(),
          body('last_name', variableDefined.variables.validation_required.last_name_required).exists(),
          body('username', variableDefined.variables.validation_required.username_required).exists(),
          body('email', variableDefined.variables.validation_required.email_required).exists().isEmail()
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
    console.log('### API Validation: ', errors);
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


exports.getCountData    =   function(req, res){
    var dataRecord      = {};
    var graphQL         = '';

    graphQL             = "MATCH (n:PERSON) RETURN COUNT(n)";
    res.setHeader( 'Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
    thePerson.neo4J
           .run(graphQL)
           .then(function (result){
                result.records.forEach(function(record){
                    dataRecord['COUNT_RECORD'] = record._fields[0].low;
               });
               return res.status(200).json({ message: variableDefined.variables.count_record, status:1, record:dataRecord });
           })
           .catch(function(err){
            return res.status(400).json({ message: variableDefined.variables.unhandledError, status:0, error:err });
        });
    thePerson.neo4J.close();
}

exports.getListData     =  async(req, res) => {
    var dataRecord      = [];
    var bodyJson        = {};
    var postBody        = req.body || null;
    var skipNumber      = 0;
    var limitNumber     = 10;
    var srchKey         = '';
    var sortByField     = '';
    var sortByDir       = '';

    if(typeof postBody !== undefined){        

        if(postBody.skip != undefined && postBody.limit != undefined){
            skipNumber      =   postBody.skip;
            limitNumber     =   postBody.limit;
            sortByField     =   postBody.sortByField;
            sortByDir       =   postBody.sortByDir;

            if(postBody.srchKey != undefined && postBody.srchKey != ''){
                srchKey = postBody.srchKey;
                bodyJson['srchKeyParam'] = srchKey;
            }
        }else{
            return res.status(409).json({ message: variableDefined.variables.person.skip_limit_required, status:0 }); 
        }
    }
    bodyJson['skipParam']          = parseInt(skipNumber);
    bodyJson['limitParam']         = parseInt(limitNumber);
    bodyJson['sortByFieldParam']   = (sortByField);
    bodyJson['sortByDirParam']     = (sortByDir);

    var graphQL             = "MATCH (n:PERSON) RETURN n ORDER BY n.firstName ASC SKIP $skipParam LIMIT $limitParam";
    //var graphQL             = "MATCH (n:PERSON) RETURN n SKIP $skipParam LIMIT $limitParam ";// + "$sortByField $sortByDir";

    if(postBody.srchKey != undefined && postBody.srchKey != ''){
    var graphQL         = "MATCH (n:PERSON) WHERE (n.email = $srchKeyParam) RETURN n ORDER BY n.firstName DESC SKIP $skipParam LIMIT $limitParam";
    }    
    thePerson.neo4J 
           .run(graphQL, bodyJson)
           .then(function (result){
                result.records.forEach(function(record){
                    if(record._fields[0].identity.low > 0){
                     record._fields[0].properties['id']  = record._fields[0].identity.low;  
                    }   
                    if(record._fields[0].cognitoUserName){
                        record._fields[0].properties['username']  = (record._fields[0].cognitoUserName != '') ? record._fields[0].cognitoUserName : NULL; 
                    }
                   dataRecord.push(record._fields[0].properties);
               });              
               return res.status(200).json({ message: variableDefined.variables.listing_record, status:1, record:dataRecord, totalRecord:dataRecord.length });
           })      
           .catch(function(err){
            return res.status(400).json({ message: variableDefined.variables.unhandledError, status:0, error:err });
        });  
        
        
    thePerson.neo4J.close();
}

// exports.createData  =  async(req, res) => {
//     var bodyJson    = {};
//     var postBody    = req.body || null;
//     var findRecord  = null;
//     //Add required validation
//     var validReturn   = theContr.apiValidation(req, res, 'create');
//     if(validReturn) return;

//     if(typeof postBody === 'object'){
//         if(postBody.password != undefined){
//             var hashPassword = encryption.encrypt(postBody.password);
//          }
        
//         //bodyJson['idParam']             = uuidv1(); 
//         bodyJson['firstNameParam']      = req.body.first_name;
//         bodyJson['lastNameParam']       = req.body.last_name;
//         bodyJson['nameParam']           = req.body.first_name + ' ' + req.body.last_name;
//         bodyJson['emailParam']          = req.body.email;
//         bodyJson['isAdminParam']        = req.body.isAdmin;
//         bodyJson['passwordParam']       = hashPassword;
//         bodyJson['usernameParam']       = req.body.username;

//         var graphMatchQL                = "MATCH (n:User) WHERE (n.email = $emailParam OR n.username = $usernameParam) RETURN n";
//         try{
//         await thePerson.neo4J 
//             .run(graphMatchQL, bodyJson)
//             .then(function (result){
//                 findRecord = 0;
//                 if(result.records != undefined && result.records.length){
//                     console.log("Exists Records", result.records[0]._fields[0] );
//                     findRecord = 1;
//                     var foundRec    =   {
//                                             id: (result.records[0]._fields[0].identity.low), 
//                                             username:result.records[0]._fields[0].properties.username 
//                                         }
//                     return res.status(409).json({ message: variableDefined.variables.record_exists, status:0, HTTP_Status:409, record: foundRec});
//                 }                
//             });
//         }
//         catch(err){
//             console.log('Unexceptional DB Error');
//         }
//         finally{
//             //Do the needful
//         };
//     }
//     if(findRecord != null && !findRecord){
//         var graphQL    = "CREATE (n:User { name:$nameParam, isAdmin:$isAdminParam, first_name: $firstNameParam, last_name: $lastNameParam,username: $usernameParam, email: $emailParam,password: $passwordParam })";
//         thePerson.neo4J
//             .run(graphQL, bodyJson)
//             .then(function (result){
//                console.log("Insert Record", result);
//                 return res.status(400).json({ message: variableDefined.variables.insert_record, status:1, record:result.summary });
//            })
//            .catch(function(err){
//                 return res.status(400).json({ message: variableDefined.variables.unhandledError, status:0, error:err });
//         });
//     }               
//     thePerson.neo4J.close();
// }
