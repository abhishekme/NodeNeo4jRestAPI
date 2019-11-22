let jwt                   = require('jsonwebtoken');
const env                 = process.env.NODE_ENV || 'development';
const config              = require('../config/config.json')[env];
var constants             = require('../config/constants');
const variableDefined     = constants[0].application;

let checkToken = (req, res, next) => {
  let token     = req.headers['authorization']; // Express headers are auto converted to lowercase
  let userId    = req.headers['userid'];

if(token != undefined && userId > 0){
    if (token) {
        jwt.verify(token, config.jwtTokenKey, (err, decoded) => {
        if (err) {
            // return res.json({
            // success: 0,
            // message: 'Token is not valid'
            // });
            return res.status(400).json({ message: "Token is not valid", HTTP_Status:400, APP_Status : 0 });

        } else {
            var userInfo    =   decoded;
            if(userInfo.id != userId){
                // return res.json({
                // success: 0,
                // message: 'Token is not valid for the user'
                // });
                return res.status(400).json({ message: "Token is not valid for the user", HTTP_Status:400, APP_Status : 0 });
            }
            req.decoded = decoded;
            console.log('Decode: ', decoded);
            return next();
        }
        });
    } else {
        console.log('Tken check...4');
        // return res.json({
        // success: 0,
        // message: 'Auth token is not supplied'
        // });
        return res.status(400).json({ message: "Auth token is not supplied", HTTP_Status:400, APP_Status : 0 });
    }
}else{
    // return res.json({
    // success: 0,
    // message: "Header authentication invalid[should be enter valid 'authorization' AND 'userid']"
    // });
    return res.status(400).json({ message: "Header authentication invalid[should be enter valid 'authorization' AND 'userid']", HTTP_Status:400, APP_Status : 0 });
}        
};

module.exports = {
  checkToken: checkToken
}