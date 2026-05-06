require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const allowedOrigins = [
  "https://petcarenow.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000"
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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to PetCare API" });
});

// Import Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const blogRoutes = require("./routes/blogs");
const orderRoutes = require("./routes/orders");
const wishlistRoutes = require("./routes/wishlist");
const uploadRoutes = require("./routes/upload");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
