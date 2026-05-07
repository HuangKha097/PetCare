const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const productRoutes = require("./products");
const cartRoutes = require("./cart");
const blogRoutes = require("./blogs");
const orderRoutes = require("./orders");
const wishlistRoutes = require("./wishlist");
const uploadRoutes = require("./upload");
const reviewRoutes = require("./reviews");
const adminRoutes = require("./admin");
const inquiryRoutes = require("./inquiries");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/blogs", blogRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/upload", uploadRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);
router.use("/inquiries", inquiryRoutes);

module.exports = router;
