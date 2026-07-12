 const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  addComment,
  getComments,
} = require("../controllers/comment.controller");

router.post(
  "/:caseId/comments",
  verifyToken,
  addComment
);

router.get(
  "/:caseId/comments",
  verifyToken,
  getComments
);

module.exports = router;