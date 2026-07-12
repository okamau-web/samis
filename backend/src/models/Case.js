const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    
transferReason: {
    type: String,
    default: ""
},
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    county: String,
    subCounty: String,
    division: String,
    location: String,
    subLocation: String,
    village: String,

    status: {
      type: String,
      enum: [
        "Reported",
        "Assigned",
        "Under Investigation",
        "Pending",
        "Resolved",
        "Closed",
        "Reopened",
      ],
      default: "Reported",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedAt: {
      type: Date,
    },

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    closedAt: {
      type: Date,
    },

    reopenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reopenedAt: {
      type: Date,
    },
    resolution: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Case", caseSchema);
