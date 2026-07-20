const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth.middleware");
const {
  createCase,
  getAllCases,
  getCaseById,
  updateCaseStatus,
  assignCase,
  deleteCase,
  restoreCase,
  getDeletedCases,
  getCaseHistory,
  transferCase,
  updateCase
} = require("../controllers/case.controller");

router.post("/", verifyToken, createCase);

router.get("/", getAllCases);

router.get(
  "/deleted/all",
  verifyToken,
  authorize("superAdmin", "Admin"),
  getDeletedCases,
);
router.get("/:caseId/history", verifyToken, getCaseHistory);

router.get("/:caseId", getCaseById);

router.patch("/:caseId/status", verifyToken, updateCaseStatus);

router.put("/:caseId", verifyToken, authorize("superAdmin", "CC"), updateCase);

router.post(
  "/:caseId/assign",
  verifyToken,
  authorize("superAdmin", "Admin"),
  assignCase,
);
router.post(
  "/:caseId/transfer",
  verifyToken,
  authorize("superAdmin", "Admin"),
  transferCase,
);
router.delete(
  "/:caseId",
  verifyToken,
  authorize("superAdmin", "Admin"),
  deleteCase,
);

router.patch(
  "/:caseId/restore",
  verifyToken,
  authorize("superAdmin"),
  restoreCase,
);

router.patch("/:caseId/status", verifyToken, updateCaseStatus);

module.exports = router;
