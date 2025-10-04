const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // giới hạn 3MB
  fileFilter: (req, file, cb) => {
    const ok = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/svg+xml",
    ].includes(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Chỉ cho phép ảnh JPG/PNG/WebP/SVG"));
  },
});

module.exports = upload;
