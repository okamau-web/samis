const mongoose = require("mongoose");

const governmentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    personalNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    nationalId: {
      type: String,
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true
    },

    designation: {
      type: String,
      required: true
    },

    county: {
      type: String,
      required: true
    },

    subCounty: {
      type: String,
      required: true
    },

    division: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    subLocation: {
      type: String,
      required: true
    },

    village: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "GovernmentProfile",
  governmentProfileSchema
);