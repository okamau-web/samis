const Case = require("../models/Case");
const User = require("../models/User");
const CaseHistory = require("../models/CaseHistory");

exports.assignCase = async (req) => {

  const { assignedTo, remarks } = req.body;

  const caseRecord = await Case.findById(req.params.caseId);

  if (!caseRecord) {
    throw new Error("Case not found.");
  }

  const officer = await User.findById(assignedTo);

  if (!officer) {
    throw new Error("Assigned officer not found.");
  }

  const previousStatus = caseRecord.status;

  caseRecord.assignedTo = officer._id;
  caseRecord.assignedBy = req.user.id;
  caseRecord.assignedAt = new Date();
  caseRecord.status = "Assigned";

  await caseRecord.save();

  await CaseHistory.create({

    case: caseRecord._id,

    action: "ASSIGNED",

    performedBy: req.user.id,

    oldValue: previousStatus,

    newValue: "Assigned",

    remarks: remarks || "",

  });

  return caseRecord;

};