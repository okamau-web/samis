const mongoose = require("mongoose");
const Case = require("../models/Case");
const User = require("../models/User");
const CaseHistoryService = require("../services/case-history.service");

const { HISTORY, logHistory } = require("../services/history.service");
const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");
const { CASE_PRIORITY, CASE_STATUS } = require("../constants/case.constants");
const CaseService = require("../services/case.service");

exports.createCase = async (req, res) => {
  try {
    const newCase = await CaseService.create(req.body, req.user);
    return successResponse(res, "Case created successfully.", newCase);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, "Case number already exists.", 409);
    }
    return errorResponse(res, error.message);
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const result = await CaseService.findAll(req.query);
    return successResponse(
      res,
      "Cases retrieved successfully.",
      result.data,
      200,
      result.meta,
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseRecord = await CaseService.findById(req.params.caseId);
    return successResponse(res, "Case retrieved successfully.", caseRecord);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, remarks } = req.body;

    const updatedCase = await CaseService.updateStatus(
      caseId,
      status,
      remarks,
      req.user,
    );

    return successResponse(
      res,
      "Case status updated successfully.",
      updatedCase,
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.assignCase = async (req, res) => {
  try {
    const result = await CaseService.assign(
      req.params.caseId,
      req.body.assignedTo,
      req.body.remarks,
      req.user,
    );
    return successResponse(res, "Case assigned successfully.", result);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.restoreCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }

    // Find deleted case
    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: true,
    });

    if (!caseRecord) {
      return errorResponse(res, 404, "Deleted case not found.");
    }

    // Restore case
    caseRecord.isDeleted = false;
    caseRecord.deletedAt = null;
    caseRecord.deletedBy = null;

    await caseRecord.save();

    // Populate relations
    await caseRecord.populate([
      {
        path: "reportedBy",
        select: "fullName username role",
      },
      {
        path: "assignedTo",
        select: "fullName username role",
      },
    ]);

    // Log history
    await logHistory({
      caseId: caseRecord._id,
      action: HISTORY.RESTORED,
      performedBy: req.user.id,
      oldValue: "Deleted",
      newValue: "Active",
      remarks: "Case restored.",
    });

    return successResponse(res, 200, "Case restored successfully.", caseRecord);
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 exports.getDeletedCases = async (req, res) => {
    try {

        const deletedCases = await CaseService.findDeleted();

        return successResponse(
            res,
            deletedCases.length === 0
                ? "No deleted cases found."
                : "Deleted cases retrieved successfully.",
            deletedCases
        );

    } catch (error) {

        return errorResponse(res, error.message);

    }
};
exports.getCaseHistory = async (req, res) => {
  try {
    const history = await CaseHistoryService.findByCase(req.params.caseId);

    return successResponse(
      res,
      history.length === 0
        ? "No case history found."
        : "Case history retrieved successfully.",
      history,
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
exports.transferCase = async (req, res) => {
  try {
    const result = await CaseService.transfer(
      req.params.caseId,

      req.body.assignedTo,

      req.body.reason,

      req.user,
    );

    return successResponse(
      res,

      "Case transferred successfully.",

      result,
    );
  } catch (error) {
    return errorResponse(
      res,

      error.message,
    );
  }
};

exports.updateCase = async (req, res) => {
  try {
    const updatedCase = await CaseService.update(
      req.params.caseId,
      req.body,
      req.user,
    );

    return successResponse(res, "Case updated successfully.", updatedCase);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await CaseService.delete(req.params.caseId, req.user);

    return successResponse(res, "Case deleted successfully.", deletedCase);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.restoreCase = async (req, res) => {
  try {

    const restoredCase = await CaseService.restore(
      req.params.caseId,
      req.user
    );

    return successResponse(
      res,
      "Case restored successfully.",
      restoredCase
    );

  } catch (error) {

    return errorResponse(res, error.message);

  }
};