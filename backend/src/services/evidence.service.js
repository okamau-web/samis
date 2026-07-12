const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const historyService = require("./evidenceHistory.service");
const EvidenceHistory = require("../models/evidenceHistory.model");

const path = require("path");
const fs = require("fs");

exports.uploadEvidence = async (req) => {
  // Verify case exists
  const caseRecord = await Case.findOne({
    _id: req.params.caseId,
    isDeleted: false,
  });

  if (!caseRecord) {
    throw new Error("Case not found.");
  }

  // Ensure files were uploaded
  if (!req.files || req.files.length === 0) {
    throw new Error("Please upload at least one file.");
  }

  const uploadedFiles = [];

  for (const file of req.files) {
    const evidence = await Evidence.create({
      caseId: caseRecord._id,
      uploadedBy: req.user.id,

      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,

      category: req.body.category || "Other",
      description: req.body.description || "",
    });

await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "UPLOAD",
    performedBy: req.user.id,
    ipAddress: req.ip,
});
    uploadedFiles.push(evidence);
  }

  return uploadedFiles;
};

exports.getCaseEvidence = async (req) => {
  const evidence = await Evidence.find({
    caseId: req.params.caseId,
    isDeleted: false,
  })
    .populate("uploadedBy", "username role")
    .sort({ createdAt: -1 });

  return evidence;
};
exports.getEvidenceById = async (req) => {
  const evidence = await Evidence.findOne({
    _id: req.params.evidenceId,
    isDeleted: false,
  })
    .populate("uploadedBy", "username role")
    .populate("caseId", "caseNumber title status");

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  return evidence;
};

exports.previewEvidence = async (req, res) => {
  const evidence = await Evidence.findOne({
    _id: req.params.evidenceId,
    isDeleted: false,
  });

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  if (!fs.existsSync(evidence.filePath)) {
    throw new Error("File not found.");
  }
await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "VIEW",
    performedBy: req.user.id,
    ipAddress: req.ip,
});
  return res.sendFile(path.resolve(evidence.filePath));
};

exports.downloadEvidence = async (req, res) => {
  const evidence = await Evidence.findOne({
    _id: req.params.evidenceId,
    isDeleted: false,
  });

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  const filePath = path.resolve(evidence.filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found.");
  }
await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "DOWNLOAD",
    performedBy: req.user.id,
    ipAddress: req.ip,
});
  return res.download(filePath, evidence.originalName);
};

exports.updateEvidence = async (req) => {
  const evidence = await Evidence.findOne({
    _id: req.params.evidenceId,
    isDeleted: false,
  });

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  evidence.category = req.body.category ?? evidence.category;

  evidence.description = req.body.description ?? evidence.description;

  await evidence.save();

await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "UPDATE",
    performedBy: req.user.id,
});
  return evidence;
};
exports.deleteEvidence = async (req) => {
  const evidence = await Evidence.findById(req.params.evidenceId);

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  evidence.isDeleted = true;
  evidence.deletedAt = new Date();
  evidence.deletedBy = req.user.id;

  await evidence.save();
await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "DELETE",
    performedBy: req.user.id,
});
  return evidence;
};
exports.restoreEvidence = async (req) => {
  const evidence = await Evidence.findById(req.params.evidenceId);

  if (!evidence) {
    throw new Error("Evidence not found.");
  }

  evidence.isDeleted = false;
  evidence.deletedAt = null;
  evidence.deletedBy = null;

  await evidence.save();
await historyService.log({
    evidenceId: evidence._id,
    caseId: evidence.caseId,
    action: "RESTORE",
    performedBy: req.user.id,
});
  return evidence;
};

exports.getStatistics = async () => {
  const totalEvidence = await Evidence.countDocuments({
    isDeleted: false,
  });

  const totalImages = await Evidence.countDocuments({
    mimeType: { $regex: "^image/" },
    isDeleted: false,
  });

  const totalVideos = await Evidence.countDocuments({
    mimeType: { $regex: "^video/" },
    isDeleted: false,
  });

  const totalDocuments = await Evidence.countDocuments({
    mimeType: {
      $in: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },
    isDeleted: false,
  });

  return {
    totalEvidence,
    totalImages,
    totalVideos,
    totalDocuments,
  };
};

exports.getHistory = async (req) => {

  return await EvidenceHistory.find({
    evidenceId: req.params.evidenceId,
  })
    .populate("performedBy", "username role")
    .sort({ createdAt: -1 });

};
