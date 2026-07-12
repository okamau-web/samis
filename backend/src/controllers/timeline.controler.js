const mongoose = require("mongoose");

const Case = require("../models/Case");
const CaseHistory = require("../models/CaseHistory");
const CaseComment = require("../models/CaseComment");
const Evidence = require("../models/Evidence");

 exports.getTimeline = async (req, res) => {
  try {

    const { caseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid case ID.",
      });
    }

    const caseRecord = await Case.findById(caseId);

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    const history = await CaseHistory.find({
      case: caseId,
    }).populate("performedBy", "fullName username role");

    const comments = await CaseComment.find({
      case: caseId,
      isDeleted: false,
    }).populate("createdBy", "fullName username role");

    const evidence = await Evidence.find({
      caseId: caseId,
    }).populate("uploadedBy", "fullName username role");

const historyEvents = history.map(item => ({
  type: "History",
  action: item.action,
  description: item.remarks,
  performedBy:
    item.performedBy?.fullName ||
    item.performedBy?.username,
  role: item.performedBy?.role,
  createdAt: item.createdAt,
}));

const commentEvents = comments.map(item => ({
  type: "Comment",
  action: "COMMENT_ADDED",
  description: item.comment,
  performedBy:
    item.createdBy?.fullName ||
    item.createdBy?.username,
  role: item.createdBy?.role,
  createdAt: item.createdAt,
}));
const evidenceEvents = evidence.map(item => ({
  type: "Evidence",
  action: "EVIDENCE_ADDED",
  description: item.originalName,
  performedBy:
    item.uploadedBy?.fullName ||
    item.uploadedBy?.username,
  role: item.uploadedBy?.role,
  createdAt: item.createdAt,
}));

const timeline = [
  ...historyEvents,
  ...commentEvents,
  ...evidenceEvents,
];

timeline.sort(
  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
);
return res.status(200).json({
  success: true,
  count: timeline.length,
  data: timeline,
});

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

  }
};