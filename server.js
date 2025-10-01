const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const categoryRoutes = require("./routes/categoryRoutes");
const UserRoutes = require("./routes/UserRoutes");
const courseRoutes = require("./routes/CourseRoutes");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/courses", courseRoutes);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
