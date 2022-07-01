const mongoose = require('mongoose');

const bossSchema = new mongoose.Schema( {
    fname: {
        type : String ,
        required : "Please enter first name"
    },
    lname: {
        type : String ,
        required : "Please enter last name"
    },
   
    
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Please enter email",
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password : {
        type : String ,
        required : "Please enter password" 
    }
 } , { timestamps: true });

module.exports = mongoose.model('boss', bossSchema) 