const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    storedName: {
      type: String,
      required: true,
      unique: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "Photo",
        "Video",
        "Witness Statement",
        "Police Report",
        "Medical Report",
        "Court Order",
        "Land Document",
        "Other",
      ],
      default: "Other",
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
evidenceSchema.index({ caseId: 1 });

evidenceSchema.index({ uploadedBy: 1 });

evidenceSchema.index({ category: 1 });

evidenceSchema.index({ createdAt: -1 });

evidenceSchema.index({ isDeleted: 1 });
module.exports = mongoose.model("Evidence", evidenceSchema);