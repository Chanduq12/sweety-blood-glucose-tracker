const pool = require("../config/db");

// DAILY REPORT
const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please select a date."
            });
        }

        const result = await pool.query(
            `SELECT time_slot, glucose_value
             FROM readings
             WHERE user_id = $1 AND reading_date = $2
             ORDER BY
                CASE time_slot
                    WHEN 'morning_fasting' THEN 1
                    WHEN 'after_breakfast' THEN 2
                    WHEN 'after_lunch' THEN 3
                    WHEN 'after_dinner' THEN 4
                END`,
            [req.user.id, date]
        );

        const readings = result.rows;
        const values = readings.map(r => r.glucose_value);

        res.json({
            date,
            count: values.length,
            highest: values.length ? Math.max(...values) : null,
            lowest: values.length ? Math.min(...values) : null,
            average: values.length
                ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
                : null,
            readings
        });

    } catch (error) {
        console.error("Daily report error:", error.message);
        res.status(500).json({
            message: "Unable to generate daily report."
        });
    }
};

// MONTH-TO-DATE REPORT
const getMonthToDateReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please select a date."
            });
        }

        const result = await pool.query(
            `SELECT glucose_value
             FROM readings
             WHERE user_id = $1
             AND reading_date >= date_trunc('month', $2::date)::date
             AND reading_date <= $2::date`,
            [req.user.id, date]
        );

        const values = result.rows.map(r => r.glucose_value);

        res.json({
            start_date: `${date.slice(0, 7)}-01`,
            end_date: date,
            count: values.length,
            highest: values.length ? Math.max(...values) : null,
            lowest: values.length ? Math.min(...values) : null,
            average: values.length
                ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
                : null
        });

    } catch (error) {
        console.error("Month-to-date report error:", error.message);
        res.status(500).json({
            message: "Unable to generate month-to-date report."
        });
    }
};

// PREVIOUS MONTH REPORT
const getMonthlyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please select a date."
            });
        }

        const result = await pool.query(
            `SELECT glucose_value
             FROM readings
             WHERE user_id = $1
             AND reading_date >= date_trunc('month', $2::date - interval '1 month')::date
             AND reading_date < date_trunc('month', $2::date)::date`,
            [req.user.id, date]
        );

        const values = result.rows.map(r => r.glucose_value);

        res.json({
            count: values.length,
            highest: values.length ? Math.max(...values) : null,
            lowest: values.length ? Math.min(...values) : null,
            average: values.length
                ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
                : null
        });

    } catch (error) {
        console.error("Monthly report error:", error.message);
        res.status(500).json({
            message: "Unable to generate monthly report."
        });
    }
};

module.exports = {
    getDailyReport,
    getMonthToDateReport,
    getMonthlyReport
};