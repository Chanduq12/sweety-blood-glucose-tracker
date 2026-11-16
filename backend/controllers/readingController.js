const pool = require("../config/db");

const validSlots = [
    "morning_fasting",
    "after_breakfast",
    "after_lunch",
    "after_dinner"
];

const addReading = async (req, res) => {
    try {
        const { reading_date, time_slot, glucose_value } = req.body;

        // Check required glucose value
        if (
            glucose_value === undefined ||
            glucose_value === null ||
            glucose_value === ""
        ) {
            return res.status(400).json({
                message: "Please enter a glucose value."
            });
        }

        // Check whole number and range
        const value = Number(glucose_value);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        // Check date and time slot
        if (!reading_date || !time_slot) {
            return res.status(400).json({
                message: "Please select a date and time slot."
            });
        }

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        // Check date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(reading_date)) {
            return res.status(400).json({
                message: "Please enter a valid date."
            });
        }

        const date = new Date(`${reading_date}T00:00:00Z`);

        if (
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== reading_date
        ) {
            return res.status(400).json({
                message: "Please enter a valid date."
            });
        }

        // Prevent future dates
        const today = new Date().toISOString().slice(0, 10);

        if (reading_date > today) {
            return res.status(400).json({
                message: "Date cannot be in the future."
            });
        }

        // Check duplicate reading for the same slot and date
        const existingReading = await pool.query(
            `SELECT id FROM readings
             WHERE user_id = $1
             AND reading_date = $2
             AND time_slot = $3`,
            [req.user.id, reading_date, time_slot]
        );

        if (existingReading.rows.length > 0) {
            const slotName = time_slot.replaceAll("_", " ");

            return res.status(409).json({
                message: `You already have an ${slotName} reading for this date.`
            });
        }

        // Check maximum four readings per day
        const dailyCount = await pool.query(
            `SELECT COUNT(*) FROM readings
             WHERE user_id = $1
             AND reading_date = $2`,
            [req.user.id, reading_date]
        );

        if (Number(dailyCount.rows[0].count) >= 4) {
            return res.status(400).json({
                message: "You can add only 4 readings per day."
            });
        }

        // Save reading
        const result = await pool.query(
            `INSERT INTO readings
             (user_id, reading_date, time_slot, glucose_value)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.id, reading_date, time_slot, value]
        );

        res.status(201).json({
            message: "Blood glucose reading added successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        console.error("Add reading error:", error.message);

        res.status(500).json({
            message: "Server error while adding reading."
        });
    }
};
const getReadings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, reading_date, time_slot, glucose_value, created_at
             FROM readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [req.user.id]
        );

        res.json({
            message: "Readings fetched successfully!",
            readings: result.rows
        });

    } catch (error) {
        console.error("Get readings error:", error.message);

        res.status(500).json({
            message: "Server error while fetching readings."
        });
    }
};
const updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { reading_date, time_slot, glucose_value } = req.body;

        if (
            !reading_date ||
            !time_slot ||
            glucose_value === undefined ||
            glucose_value === null ||
            glucose_value === ""
        ) {
            return res.status(400).json({
                message: "Please provide all reading details."
            });
        }

        const value = Number(glucose_value);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        const validSlots = [
            "morning_fasting",
            "after_breakfast",
            "after_lunch",
            "after_dinner"
        ];

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        const result = await pool.query(
            `UPDATE readings
             SET reading_date = $1,
                 time_slot = $2,
                 glucose_value = $3
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [reading_date, time_slot, value, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.json({
            message: "Reading updated successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A reading already exists for this date and time slot."
            });
        }

        console.error("Update reading error:", error.message);

        res.status(500).json({
            message: "Server error while updating reading."
        });
    }
};
const deleteReading = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM readings
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.json({
            message: "Reading deleted successfully!"
        });

    } catch (error) {
        console.error("Delete reading error:", error.message);

        res.status(500).json({
            message: "Server error while deleting reading."
        });
    }
};
module.exports = { addReading, getReadings, updateReading, deleteReading };