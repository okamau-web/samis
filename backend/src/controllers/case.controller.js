const mongoose = require("mongoose");
const Case = require("../models/Case");
const User = require("../models/User");
const CaseHistory = require("../models/CaseHistory");
const { HISTORY, logHistory } = require("../services/history.service");
const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");
const { CASE_PRIORITY, CASE_STATUS } = require("../constants/case.constants");

exports.createCase = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
    } = req.body;

    const requiredFields = {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
    };

    const missingField = Object.entries(requiredFields).find(
      ([, value]) => !value,
    );

    if (missingField) {
      return errorResponse(res, 400, `${missingField[0]} is required.`);
    }

    if (!CASE_PRIORITY.includes(priority)) {
      return errorResponse(res, 400, "Invalid priority selected.");
    }

    const totalCases = await Case.countDocuments();

    const nextNumber = (totalCases + 1).toString().padStart(6, "0");

    const currentYear = new Date().getFullYear();

    const caseNumber = `SAMIS-${currentYear}-${nextNumber}`;

    const newCase = await Case.create({
      caseNumber,
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
      reportedBy: req.user.id,
    });

    await logHistory({
      caseId: newCase._id,
      action: HISTORY.CREATED,
      performedBy: req.user.id,
      newValue: newCase.caseNumber,
      remarks: "Case created successfully.",
    });

    return successResponse(res, 201, "Case created successfully", newCase);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 409, "Case number already exists.");
    }
    console.error(error);
    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const {
      status,
      priority,
      county,
      category,
      assignedTo,
      search,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "priority",
      "status",
      "category",
      "caseNumber",
      "title",
    ];
    if (!allowedSortFields.includes(sort)) {
      return errorResponse(res, 400, "Invalid sort field.");
    }
    const allowedOrders = ["asc", "desc"];

    if (!allowedOrders.includes(order)) {
      return errorResponse(res, 400, "Sort order must be 'asc' or 'desc'.");
    }
    const filter = {
      isDeleted: { $ne: true },
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (county) {
      filter.county = county;
    }

    if (category) {
      filter.category = category;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        {
          caseNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    const currentPage = Number(page);
    const pageSize = Number(limit);

    if (currentPage < 1 || pageSize < 1) {
      return errorResponse(
        res,
        400,
        "Page and limit must be greater than zero.",
      );
    }
    if (pageSize > 100) {
      return errorResponse(res, 400, "Maximum page size is 100.");
    }
    const skip = (currentPage - 1) * pageSize;

    const sortOptions = {
      [sort]: order === "asc" ? 1 : -1,
    };
    const cases = await Case.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .populate("reportedBy", "username role")
      .populate("assignedTo", "username role");

    const totalCases = await Case.countDocuments(filter);
    const totalPages = Math.ceil(totalCases / pageSize);

    return successResponse(
      res,
      200,
      cases.length === 0
        ? "No matching cases found."
        : "Cases retrieved successfully.",
      cases,
      {
        count: cases.length,
        pagination: {
          currentPage,
          pageSize,
          totalCases,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        },
      },
    );
  } catch (error) {
    return errorResponse(res, 400, "An unexpected error occurred.");
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }
    // Find case
    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: { $ne: true },
    })
      .populate("reportedBy", "username role")
      .populate("assignedTo", "username role");

    if (!caseRecord) {
      return errorResponse(res, 404, "Case not found.");
    }

    return successResponse(
      res,
      200,
      "Case retrieved successfully.",
      caseRecord,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }

    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: { $ne: true },
    });

    if (!caseRecord) {
      return errorResponse(res, 404, "Case not found.");
    }

    if (!CASE_STATUS.includes(status)) {
      return errorResponse(res, 400, "Invalid status.");
    }

    if (caseRecord.status === status) {
      return errorResponse(res, 400, "Case already has this status.");
    }

    if (caseRecord.status === CASE_STATUS.CLOSED) {
      return errorResponse(res, 400, "Closed cases cannot be updated.");
    }

    const oldStatus = caseRecord.status;

    caseRecord.status = status;

    await caseRecord.save();

    await logHistory({
      caseId: caseRecord._id,
      action: HISTORY.STATUS_CHANGED,
      performedBy: req.user.id,
      oldValue: oldStatus,
      newValue: status,
      remarks: remarks || "",
    });

    return successResponse(
      res,
      200,
      "Case status updated successfully.",
      caseRecord,
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { assignedTo, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return errorResponse(res, 400, "Invalid officer ID.");
    }

    const officer = await User.findById(assignedTo);

    if (!officer) {
      return errorResponse(res, 404, "Officer not found.");
    }

    const caseRecord = await Case.findById(caseId);
    if (!caseRecord || caseRecord.isDeleted) {
      return errorResponse(res, 404, "Case not found.");
    }

    const previousOfficer = caseRecord.assignedTo;
    caseRecord.assignedTo = assignedTo;
    caseRecord.assignedBy = req.user.id;
    caseRecord.assignedAt = new Date();
    caseRecord.status = CASE_STATUS.Assigned;

    await caseRecord.save();

    await logHistory({
      caseId: caseRecord._id,
      action: HISTORY.ASSIGNED,
      performedBy: req.user.id,
      oldValue: previousOfficer ? previousOfficer.toString() : "Unassigned",
      newValue: officer.fullName || officer.username,
      remarks: remarks || "case assigned",
    });
    await caseRecord.populate("assignedTo", "fullName username role");

    return successResponse(res, 200, "Case assigned successfully.", caseRecord);
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }

    // Find case
    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: { $ne: true },
    });

    if (!caseRecord) {
      return errorResponse(res, 404, "Case not found.");
    }

    // Soft delete
    caseRecord.isDeleted = true;
    caseRecord.deletedAt = new Date();
    caseRecord.deletedBy = req.user.id;

    await caseRecord.save();

    // Populate deletedBy
    await caseRecord.populate("deletedBy", "fullName username role");

    // Log history
    await logHistory({
      caseId: caseRecord._id,
      action: HISTORY.DELETED,
      performedBy: req.user.id,
      oldValue: "Active",
      newValue: "Deleted",
      remarks: "Case deleted.",
    });

    return successResponse(res, 200, "Case deleted successfully.", caseRecord);
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};

 exports.restoreCase = async (req, res) => {
  try {

    const { caseId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(
        res,
        400,
        "Invalid case ID."
      );
    }

    // Find deleted case
    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: true,
    });

    if (!caseRecord) {
      return errorResponse(
        res,
        404,
        "Deleted case not found."
      );
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

    return successResponse(
      res,
      200,
      "Case restored successfully.",
      caseRecord
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "An unexpected error occurred."
    );

  }
};

 exports.getDeletedCases = async (req, res) => {
  try {

    const deletedCases = await Case.find({
      isDeleted: true,
    })
      .populate("reportedBy", "fullName username role")
      .populate("assignedTo", "fullName username role")
      .populate("deletedBy", "fullName username role")
      .sort({ deletedAt: -1 });

    return successResponse(
      res,
      200,
      deletedCases.length === 0
        ? "No deleted cases found."
        : "Deleted cases retrieved successfully.",
      deletedCases,
      {
        count: deletedCases.length,
      }
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "An unexpected error occurred."
    );

  }
};
exports.getCaseHistory = async (req, res) => {
  try {

    const { caseId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(
        res,
        400,
        "Invalid case ID."
      );
    }

    // Verify case exists
    const caseRecord = await Case.findById(caseId);

    if (!caseRecord) {
      return errorResponse(
        res,
        404,
        "Case not found."
      );
    }

    // Retrieve history
    const history = await CaseHistory.find({
      case: caseId,
    })
      .populate("performedBy", "fullName username role")
      .sort({ createdAt: 1 });

    // Format timeline
    const timeline = history.map((item) => ({
      action: item.action,

      performedBy:
        item.performedBy?.fullName ||
        item.performedBy?.username ||
        "System",

      role: item.performedBy?.role || "System",

      from: item.oldValue,

      to: item.newValue,

      remarks: item.remarks,

      performedAt: item.createdAt.toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));

    return successResponse(
      res,
      200,
      timeline.length === 0
        ? "No case history found."
        : "Case history retrieved successfully.",
      timeline,
      {
        count: timeline.length,
      }
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "An unexpected error occurred."
    );

  }
};

exports.transferCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { assignedTo, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return errorResponse(res, 400, "Invalid case ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return errorResponse(res, 400, "Invalid Officer ID.");
    }

    const caseRecord = await Case.findOne({
      _id: caseId,
      isDeleted: { $ne: true },
    });

    if (!caseRecord) {
      return errorResponse(res, 404, "Case not found.");
    }
    if (
      ![
        CASE_STATUS[1], // Assigned
        CASE_STATUS[2], // Under Investigation
      ].includes(caseRecord.status)
    ) {
      return errorResponse(res, 400, "Only active cases can be transferred.");
    }

    const newOfficer = await User.findById(assignedTo);

    if (!newOfficer) {
      return errorResponse(res, 404, "Officer not found.");
    }

    if (
      caseRecord.assignedTo &&
      caseRecord.assignedTo.toString() === assignedTo
    ) {
      return errorResponse(
        res,
        400,
        "Case is already assigned to this officer.",
      );
    }

    let previousOfficerName = "Unassigned";
    if (!caseRecord.assignedTo) {
      return errorResponse(res, 400, "Case has not been assigned yet.");
    }

    if (caseRecord.assignedTo) {
      const previousOfficer = await User.findById(caseRecord.assignedTo);

      if (previousOfficer) {
        previousOfficerName =
          previousOfficer.fullName || previousOfficer.username;
      }
    }

    caseRecord.assignedTo = assignedTo;
    caseRecord.assignedBy = req.user.id;
    caseRecord.assignedAt = new Date();
    caseRecord.transferReason = reason || "";

    await caseRecord.save();

    await logHistory({
      caseId: caseRecord._id,
      action: HISTORY.TRANSFERRED,
      performedBy: req.user.id,
      oldValue: previousOfficerName,
      newValue: newOfficer.fullName || newOfficer.username,
      remarks: reason || "Case transferred.",
    });
    await caseRecord.populate([
      {
        path: "assignedTo",
        select: "fullName username role",
      },
      {
        path: "assignedBy",
        select: "fullName username",
      },
    ]);
    return successResponse(
      res,
      200,
      "Case transferred successfully.",
      caseRecord,
    );
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, "An unexpected error occurred.");
  }
};
