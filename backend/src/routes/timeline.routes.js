const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
    getTimeline,
} = require("../controllers/timeline.controler");

router.get(
    "/:caseId/timeline",
    verifyToken,
    getTimeline
);

module.exports = router;