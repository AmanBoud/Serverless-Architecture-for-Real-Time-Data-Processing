const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Get All Sensor Data
app.get("/sensors", (req, res) => {
  db.query("SELECT * FROM sensor_data", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get Sensor Data by Device ID
app.get("/sensors/device/:device_id", (req, res) => {
  const { device_id } = req.params;
  db.query(
    "SELECT * FROM sensor_data WHERE device_id=?",
    [device_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Add New Sensor Data
app.post("/sensors", (req, res) => {
  const { device_id, temperature, humidity } = req.body;

  if (!device_id || temperature === undefined || humidity === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO sensor_data (device_id, temperature, humidity) VALUES (?, ?, ?)",
    [device_id, temperature, humidity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Sensor data added", device_id });
    }
  );
});

// Update Sensor Data
app.put("/sensors/:device_id", (req, res) => {
  const { device_id } = req.params;
  const { temperature, humidity } = req.body;

  if (temperature === undefined || humidity === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "UPDATE sensor_data SET temperature=?, humidity=? WHERE device_id=?",
    [temperature, humidity, device_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Sensor data updated" });
    }
  );
});

// Delete Sensor Data
app.delete("/sensors/:device_id", (req, res) => {
  const { device_id } = req.params;

  db.query(
    "DELETE FROM sensor_data WHERE device_id=?",
    [device_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Sensor data deleted" });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
