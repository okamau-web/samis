 const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    userType:{
        type:String,
        enum:["Government","Citizen"],
        required:true
    },

    role:{
        type:String,

        enum:[
            "superAdmin",
            "CC",
            "DCC",
            "ACC",
            "Chief",
            "AssistantChief",
            "Citizen"
        ],

        required:true
    },

    status:{
        type:String,
        enum:["Active","Inactive","Suspended"],
        default:"Active"
    },

    lastLogin:{
        type:Date
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);