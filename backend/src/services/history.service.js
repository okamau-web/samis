 const CaseHistory = require("../models/CaseHistory");

const HISTORY = {
  CREATED: "CREATED",
  UPDATED:"UPDATED",

  ASSIGNED: "ASSIGNED",
  TRANSFERRED: "TRANSFERRED",

  STATUS_CHANGED: "STATUS_CHANGED",

  COMMENT_ADDED: "COMMENT_ADDED",
  EVIDENCE_ADDED: "EVIDENCE_ADDED",

  CLOSED: "CLOSED",
  REOPENED: "REOPENED",

  DELETED:"DELETED",
  RESTORED:"RESTORED",

  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const logHistory = async ({
  caseId,
  action,
  performedBy,
  oldValue = null,
  newValue = null,
  remarks = "",
}) => {
  try {
    await CaseHistory.create({
      case: caseId,
      action,
      performedBy,
      oldValue,
      newValue,
      remarks,
    });
  } catch (error) {
    console.error("History Log Error:", error);
  }
};

module.exports = {
  HISTORY,
  logHistory,
};