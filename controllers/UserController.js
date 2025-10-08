const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

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

// Đăng nhập bằng Google
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ msg: "idToken is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullname: name,
        email,
        dob: new Date("2000-01-01"),
        phone: "",
        password: await bcrypt.hash(Math.random().toString(36), 10),
        role: "hocsinh",
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        name: user.fullname,
        role: user.role,
      },
    });
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

// Admin: Lấy tất cả users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { fullname, dob, email, phone, role, password } = req.body;
    const updateData = { fullname, dob, email, phone, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });

    res.json({ msg: "Cập nhật user thành công", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });

    res.json({ msg: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
