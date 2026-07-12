const mongoose = require("mongoose");

const evidenceHistorySchema = new mongoose.Schema(
  {
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evidence",
      required: true,
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "UPLOAD",
        "VIEW",
        "DOWNLOAD",
        "UPDATE",
        "DELETE",
        "RESTORE",
      ],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EvidenceHistory",
  evidenceHistorySchema
);