const mongoose = require("mongoose");

const citizenProfileSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    nationalId:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    fullName:{
        type:String,
        required:true,
        trim:true
    },

    gender:{
        type:String,
        enum:["Male","Female","Other"],
        required:true
    },

    dateOfBirth:{
        type:Date
    },

    phoneNumber:{
        type:String,
        required:true
    },

    email:{
        type:String,
        lowercase:true
    },

    county:{
        type:String,
        required:true
    },

    ward:{
        type:String,
        required:true
    },

    village:{
        type:String
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "CitizenProfile",
    citizenProfileSchema
);