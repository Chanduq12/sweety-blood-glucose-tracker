import { useEffect, useState } from "react";
import API from "./api";

function Dashboard({ token }) {
  const [readings, setReadings] = useState([]);
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [slot, setSlot] = useState("morning_fasting");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [dailyReport, setDailyReport] = useState(null);
const [monthReport, setMonthReport] = useState(null);
const [monthlyReport, setMonthlyReport] = useState(null);
const [reportDate, setReportDate] = useState(
  new Date().toLocaleDateString("en-CA")
);
const [reportMessage, setReportMessage] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
const loadReports = async () => {
  try {
    const [daily, monthToDate, monthly] = await Promise.all([
      API.get(`/reports/daily?date=${reportDate}`, config),
      API.get(`/reports/month-to-date?date=${reportDate}`, config),
      API.get(`/reports/monthly?date=${reportDate}`, config)
    ]);

    setDailyReport(daily.data);
    setMonthReport(monthToDate.data);
    setMonthlyReport(monthly.data);
    setReportMessage("");
  } catch (error) {
    setReportMessage(
      error.response?.data?.message || "Unable to load reports."
    );
  }
};
  const loadReadings = async () => {
    try {
      const response = await API.get("/readings", config);
      setReadings(response.data.readings);
    } catch (error) {
      setMessage("Unable to load readings.");
    }
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const addReading = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post(
        "/readings",
        {
          reading_date: date,
          time_slot: slot,
          glucose_value: Number(value)
        },
        config
      );

      setMessage(response.data.message);
      setValue("");
      loadReadings();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to add reading."
      );
    }
  };

  const deleteReading = async (id) => {
    const editReading = async (reading) => {
  const newValue = window.prompt(
    "Enter the updated glucose value (40–600):",
    reading.glucose_value
  );

  if (newValue === null) return;

  const value = Number(newValue);

  if (!Number.isInteger(value) || value < 40 || value > 600) {
    setMessage("Value must be between 40 and 600 mg/dl.");
    return;
  }

  try {
    const response = await API.put(
      `/readings/${reading.id}`,
      {
        reading_date: reading.reading_date.slice(0, 10),
        time_slot: reading.time_slot,
        glucose_value: value
      },
      config
    );

    setMessage(response.data.message);
    loadReadings();
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Unable to update reading."
    );
  }
};
    if (!window.confirm("Delete this reading?")) return;

    try {
      const response = await API.delete(`/readings/${id}`, config);
      setMessage(response.data.message);
      loadReadings();
    } catch (error) {
      setMessage("Unable to delete reading.");
    }
  };

  return (
    <div className="dashboard">
      <h1>💗 Sweety Dashboard</h1>
      <p>Track your blood glucose levels</p>

      <div className="reading-card">
        <h2>Add Glucose Reading</h2>

        <form onSubmit={addReading}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            max={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Time Slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          >
            <option value="morning_fasting">Morning (Fasting)</option>
            <option value="after_breakfast">After Breakfast</option>
            <option value="after_lunch">After Lunch</option>
            <option value="after_dinner">After Dinner</option>
          </select>

          <label>Glucose Value (mg/dl)</label>
          <input
            type="number"
            min="40"
            max="600"
            step="1"
            placeholder="Enter value (40–600)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <button type="submit">Add Reading</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="reading-card">
        <h2>Your Reading History</h2>

        {readings.length === 0 ? (
          <p>No readings yet. Add your first reading!</p>
        ) : (
          readings.map((reading) => (
           <div>
  <button
    onClick={() => editReading(reading)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => deleteReading(reading.id)}
  >
    Delete
  </button>
</div>
          ))
        )}
        <div className="reading-card">
        <h2>📊 Glucose Reports</h2>

        <label>Select Report Date</label>
        <input
          type="date"
          value={reportDate}
          max={new Date().toLocaleDateString("en-CA")}
          onChange={(e) => setReportDate(e.target.value)}
        />

        <button onClick={loadReports}>
          Generate Reports
        </button>

        {reportMessage && (
          <p className="message">{reportMessage}</p>
        )}

        {dailyReport && (
          <div>
            <h3>Daily Report</h3>
            <p>Total Readings: {dailyReport.count}</p>
            <p>Highest: {dailyReport.highest ?? "No data"} mg/dl</p>
            <p>Lowest: {dailyReport.lowest ?? "No data"} mg/dl</p>
            <p>Average: {dailyReport.average ?? "No data"} mg/dl</p>
          </div>
        )}

        {monthReport && (
          <div>
            <h3>Month-to-Date Report</h3>
            <p>Total Readings: {monthReport.count}</p>
            <p>Highest: {monthReport.highest ?? "No data"} mg/dl</p>
            <p>Lowest: {monthReport.lowest ?? "No data"} mg/dl</p>
            <p>Average: {monthReport.average ?? "No data"} mg/dl</p>
          </div>
        )}

        {monthlyReport && (
          <div>
            <h3>Previous Month Report</h3>
            <p>Total Readings: {monthlyReport.count}</p>
            <p>Highest: {monthlyReport.highest ?? "No data"} mg/dl</p>
            <p>Lowest: {monthlyReport.lowest ?? "No data"} mg/dl</p>
            <p>Average: {monthlyReport.average ?? "No data"} mg/dl</p>
          </div>
        )}
      </div>
      </div>
    </div>
    
  );
}

export default Dashboard;