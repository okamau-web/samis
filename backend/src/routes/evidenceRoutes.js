 const express = require("express");
const router = express.Router();

const evidenceController = require("../controllers/evidenceController");
 
const { verifyToken } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

 
router.post(
  "/:caseId/upload",
  verifyToken,
  upload.array("files", 10),
  evidenceController.uploadEvidence
);

router.get(
  "/:caseId",
  verifyToken,
  evidenceController.getCaseEvidence
);
router.get(
  "/item/:evidenceId",
  verifyToken,
  evidenceController.getEvidenceById
);

router.get(
  "/preview/:evidenceId",
  verifyToken,
  evidenceController.previewEvidence
);

router.get(
  "/download/:evidenceId",
  verifyToken,
  evidenceController.downloadEvidence
);

router.patch(
  "/:evidenceId",
  verifyToken,
  evidenceController.updateEvidence
);

router.delete(
  "/:evidenceId",
  verifyToken,
  evidenceController.deleteEvidence
);

router.put(
  "/:evidenceId/restore",
  verifyToken,
  evidenceController.restoreEvidence
);

router.get(
  "/statistics/summary",
  verifyToken,
  evidenceController.getStatistics
);

router.get(
  "/history/:evidenceId",
  verifyToken,
  evidenceController.getHistory
);
module.exports = router;