'use strict'

module.exports  = 
[
    {
        "application" : 
        {
            "apiPrefix"                         : "/api/",
            "serverPath" : {
                "mediaDir"                      : "./public/",
                "userUploadDir"                 : "./public/user-media/",
                "userExport"                    : "./public/user-media/export/",
                "userImport"                    : "./public/user-media/import/",
            },
            "contentType" : {
                "urlencode"                     : "application/x-www-form-urlencoded",
                "formdata"                      : "multipart/form-data",
            },
            "auth"        : {
                "token_invalid"                 : "Token is not valid",
                "token_invalid_user"            : "Token is not valid for the user",
                "token_not_enter"               : "Auth token is not supplied",
                "token_header"                  : "Header authentication invalid[should be enter valid 'authorization' AND 'userid']",
            },       
            "variables": {
                "validation_required":          {
                "first_name_required"           : "First name is required",
                "last_name_required"            : "Last name is required",
                "username_required"             : "Username is required",
                "email_required"                : "Email is required, should be valid",
                "email_or_username_exists"      : "Username/Email Exists! please try another",
                "email_not_exists"              : "Email Not Exists!",
                "password_invalid"              : "Password is invalid, please try again",
                "unauthorize_login"             : "You Are not authorize user to Login",
                "unauthorize_change_password"   : "You Are not authorize user to Change Password",
                "password_equal"                : "New and Old Password should different",
                "password_match"                : "Confirm Password is invalid, please try again",
                "password_required"             : "Password is required",
                "password_strength_step1"       : "Should be minimum 5 and maximum 15 character long.",
                "password_strength_step2"       : "Password should not be empty, minimum 5 characters, at least one capital and small letter, one number and one special chracter",
                "password_update"               : "Update Password Successfully",
                },

                "login_success"                 : "Login Success",
                "id_not_found"                  : "ID Not Found",
                "user_picture_extension"        : ".jpg",
                "user_picture_max_size"         : 1,
                "image_upload_max_size"         : "Maximum upload image 2MB",
                "user_picture_upload_encoding"  : "base64",                
                
                "record_inserted"               : "Record Inserted Succesfully",
                "record_updated"                : "Record Updated Succesfully",
                "record_update_error"           : "Database Update Error",
                "record_deleted"                : "Record Deleted Succesfully",
                "record_deleted_error"          : "Record Already Deleted",
                "record_exists"                 : "Record Already Exists, please check your Email or Username",

                "logout_success"                :  "Logout Successfully, Please login again",
                "logout_unSuccess"              :  "Logout Unsuccessfull, Please try again",
                "logged_in"                     :  "You Logged In",
                "logged_out"                    :  "Token Expired, Please login again",

                "csvFileCreated"                :   "CSV file created succesfully",
                "csvFileUploaded"               :   "File uploaded succesfully",
                "csvFileImportError"            :   "Please upload only csv[.csv] file",

                "listing_record"                :   "Listing Record",
                "count_record"                  :   "Total Count",
                "insert_record"                 :   "Record Inserted Successfully",

                "unhandledError"                :   "Unhanled API server(neo4j) Error!"
            },
            "exportTable" : {
                "userCsvHeader" : [
                    {id: 'first_name', title: 'First Name'},{id: 'last_name', title: 'Last Name'},{id: 'username', title: 'Username'},
                    {id: 'address', title: 'Address'},{id: 'city', title: 'City'}
                ]
            },            
        },
  }
]