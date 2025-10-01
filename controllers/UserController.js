const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { fullname, dob, email, phone, password, role } = req.body;

    // kiểm tra email tồn tại
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: " Email đã tồn tại" });
    }

    // hash password
    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      dob,
      email,
      phone,
      password: hashPass,
      role,
    });

    await user.save();
    res.status(201).json({ msg: " Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Đăng nhập thành công", token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ msg: " Không có token" });

      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ msg: " Token không hợp lệ" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // check role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Không có quyền truy cập" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: "Token không hợp lệ" });
    }
  };
};

// Lấy thông tin profile của user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
