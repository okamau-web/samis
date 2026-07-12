const mongoose = require("mongoose");
const Case = require("../models/Case");
const CaseComment = require("../models/CaseComment");
const { logHistory, HISTORY } = require("../services/history.service");
const {
  successResponse,
  errorResponse,
} = require("../helpers/response.helper");

 exports.addComment = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid case ID.",
      });
    }

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment is required.",
      });
    }

    const caseRecord = await Case.findById(caseId);

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    const newComment = await CaseComment.create({
      case: caseId,
      createdBy: req.user.id,
      comment,
    });

    await logHistory({
      caseId,
      action:HISTORY.COMMENT_ADDED,
      performedBy: req.user.id,
      remarks: comment,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: newComment,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

 exports.getComments = async (req, res) => {
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

    const comments = await CaseComment.find({
      case: caseId,
      isDeleted: false,
    })
      .populate("createdBy", "fullName username role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });

  }
};