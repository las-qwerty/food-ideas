// Simple Express server for food ideas
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, "food-ideas.json");

app.use(cors());
app.use(express.json());

// Helper to read data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all food ideas
app.get("/food-ideas", (req, res) => {
  const ideas = readData();
  res.json(ideas);
});

// Add a new food idea
app.post("/food-ideas", (req, res) => {
  const newIdea = req.body;
  const ideas = readData();
  ideas.push({ ...newIdea, id: Date.now() });
  writeData(ideas);
  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
