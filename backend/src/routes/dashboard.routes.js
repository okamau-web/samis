const express = require("express");

const router = express.Router();

const {
  getDashboardSummary,
  getCasesByCategory,
  getCasesByCounty,
  getMonthlyCases,
  getOfficerWorkload,
  getRecentActivity,
} = require("../controllers/dashboard.controller");

const { verifyToken } = require("../middleware/auth.middleware");

// Protect all dashboard endpoints
router.use(verifyToken);

// Dashboard
router.get("/summary", getDashboardSummary);
router.get("/recent-activity", getRecentActivity);

// Statistics
router.get("/categories", getCasesByCategory);
router.get("/counties", getCasesByCounty);
router.get("/monthly", getMonthlyCases);
router.get("/workload", getOfficerWorkload);

module.exports = router;
