require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://petcarenow.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PetCare API" });
});

// API Routes
app.use("/api", routes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
