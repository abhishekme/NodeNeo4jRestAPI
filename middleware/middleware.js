const jwt                   = require('jsonwebtoken');
const env                 = process.env.NODE_ENV || 'development';
const config              = require('../config/config.json')[env];
var constants             = require('../config/constants');
const variableDefined     = constants[0].application;

let checkToken  = (req, res, next) => {
let token       = req.headers['authorization']; // Express headers are auto converted to lowercase
let userId      = req.headers['userid'];

if(token != undefined && userId > 0){
    if (token) {
        jwt.verify(token, config.jwtTokenKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: variableDefined.auth.token_invalid, HTTP_Status:400, APP_Status : 0 });
        } else {
            var userInfo    =   decoded;
            if(userInfo.id != userId){
                return res.status(400).json({ message: variableDefined.auth.token_invalid_user, HTTP_Status:400, APP_Status : 0 });
            }
            req.decoded = decoded;
            return next();
        }
        });
    } else {
        return res.status(400).json({ message: variableDefined.auth.token_not_enter, HTTP_Status:400, APP_Status : 0 });
    }
}else{
    return res.status(400).json({ message: variableDefined.auth.token_header, HTTP_Status:400, APP_Status : 0 });
}        
};

module.exports = {
  checkToken: checkToken
}