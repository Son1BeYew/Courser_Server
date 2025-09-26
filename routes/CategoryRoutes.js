const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controllers/CategoryController");

router.get("/", categoryCtrl.getAll);
router.post("/", categoryCtrl.create);

module.exports = router;
