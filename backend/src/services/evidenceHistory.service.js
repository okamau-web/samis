const EvidenceHistory = require("../models/evidenceHistory.model");

exports.log = async ({
  evidenceId,
  caseId,
  action,
  performedBy,
  remarks = "",
  ipAddress = "",
}) => {

  await EvidenceHistory.create({
    evidenceId,
    caseId,
    action,
    performedBy,
    remarks,
    ipAddress,
  });

};