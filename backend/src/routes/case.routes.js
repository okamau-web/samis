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
    transferCase
} = require("../controllers/case.controller");

router.post("/", verifyToken, createCase);

router.get("/", getAllCases);
 

router.get(
  "/deleted/all",
  verifyToken,
  authorize("superAdmin", "Admin"),
  getDeletedCases
);
router.get(
  "/:id/history",
  verifyToken,
  getCaseHistory
);

router.get("/:caseId", getCaseById);

 router.patch(
    "/:id/status",
    verifyToken,
    updateCaseStatus
);

router.post(
  "/:caseId/assign",
  verifyToken,
  authorize("superAdmin", "Admin"),
  assignCase,
);
 router.post(
    "/:id/transfer",
    verifyToken,
    authorize("superAdmin", "Admin"),
    transferCase
);
router.delete(
  "/:id",
  verifyToken,
  authorize("superAdmin", "Admin"),
  deleteCase,
);

router.patch("/:id/restore",
   verifyToken, 
   authorize("superAdmin"), 
   restoreCase);



module.exports = router;
