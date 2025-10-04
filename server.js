const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const categoryRoutes = require("./routes/CategoryRoutes");
const UserRoutes = require("./routes/UserRoutes");
const courseRoutes = require("./routes/CourseRoutes");

const sessionRoutes = require("./routes/SessionRoutes");
const recordingRoutes = require("./routes/RecordingRoutes");
const apiInfoRoutes = require("./routes/ApiInfoRoutes");
const auth = require("./middleware/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const app = express();
connectDB();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerDocs);
});
app.use("/api/info", apiInfoRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/categories", auth, categoryRoutes);
app.use("/api/courses", auth, courseRoutes);
app.use("/api/sessions", auth, sessionRoutes);
app.use("/api/recordings", auth, recordingRoutes);



const PORT = 5000;

// Start the server only if the file is run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () =>
    console.log(` Server chạy tại http://0.0.0.0:${PORT}`)
  );
}

module.exports = app;
