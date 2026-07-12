 const express = require("express");
const router = express.Router();

const {
getDashboardSummary,
getCasesByCategory,
getCasesByCounty,
getMonthlyCases,
getOfficerWorkload,
getRecentActivity

} = require("../controllers/dashboard.controller");

router.get("/summary", getDashboardSummary);
router.get("/categories", getCasesByCategory);
router.get("/counties", getCasesByCounty);
router.get("/monthly", getMonthlyCases);
router.get("/workload", getOfficerWorkload);
router.get("/recent-activity", getRecentActivity);

module.exports = router;