const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getDailyReport,
    getMonthToDateReport,
    getMonthlyReport
} = require("../controllers/reportController");

router.get("/daily", protect, getDailyReport);
router.get("/month-to-date", protect, getMonthToDateReport);
router.get("/monthly", protect, getMonthlyReport);

module.exports = router;