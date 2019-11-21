let jwt          = require('jsonwebtoken');
const env        = process.env.NODE_ENV || 'development';
const config     = require('../config/config.json')[env];

let checkToken = (req, res, next) => {
  let token     = req.headers['authorization']; // Express headers are auto converted to lowercase
  let userId    = req.headers['userid'];      
  ///console.log('Headers ', req.headers);

if(token != undefined && userId > 0){
    if (token) {
        jwt.verify(token, config.jwtTokenKey, (err, decoded) => {
        if (err) {
            console.log('Tken check...2');
            return res.json({
            success: 0,
            message: 'Token is not valid'
            });
        } else {
            console.log('Tken check...3', decoded);
            var userInfo    =   decoded;
            if(userInfo.id != userId){
                return res.json({
                success: 0,
                message: 'Token is not valid for the user'
                });
            }

            req.decoded = decoded;
            return next();
        }
        });
    } else {
        console.log('Tken check...4');
        return res.json({
        success: 0,
        message: 'Auth token is not supplied'
        });
    }
}else{
    return res.json({
    success: 0,
    message: 'Header authentication invalid'
    });
}        
};

module.exports = {
  checkToken: checkToken
}