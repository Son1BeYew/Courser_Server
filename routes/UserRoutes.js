const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Đăng ký
router.post("/register", UserController.register);

// Đăng nhập
router.post("/login", UserController.login);

// API chỉ Admin được truy cập
router.get("/admin", UserController.authMiddleware(["admin"]), (req, res) => {
  res.json({ msg: "Chào Admin" });
});

// API giảng viên và admin
router.get(
  "/giangvien",
  UserController.authMiddleware(["giangvien", "admin"]),
  (req, res) => {
    res.json({ msg: "Chào giảng viên hoặc admin" });
  }
);

// API cho tất cả
router.get(
  "/hocsinh",
  UserController.authMiddleware(["hocsinh", "giangvien", "admin"]),
  (req, res) => {
    res.json({ msg: "Chào học sinh, giảng viên hoặc admin" });
  }
);

module.exports = router;
