const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {
        type : String ,
        required : [true , "Please ass the user name"]
    },
    email : {
        type : String , 
        required : [true , "Please add the user email address"],
        // unique : [true , "Email address already registered "]

    }, 
    password : {
        type : String , 
        required : [true , "Please add the user password"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }

}, {
    timestamps : true
})

module.exports = mongoose.model("User" , userSchema);