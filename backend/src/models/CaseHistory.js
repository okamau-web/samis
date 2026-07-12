const mongoose = require("mongoose");

const caseHistorySchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

  action: {
  type: String,
  enum: [
    "CREATED",
    "ASSIGNED",
    "TRANSFERRED",
    "ESCALATED",
    "STATUS_CHANGED",
    "PRIORITY_CHANGED",
    "EVIDENCE_ADDED",
    "COMMENT_ADDED",
    "CLOSED",
    "REOPENED",
    "DELETED",
    "RESTORED",
  ],
  required: true,
},


    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    oldValue: {
      type: String,
      default: null,
    },

    newValue: {
      type: String,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CaseHistory", caseHistorySchema);