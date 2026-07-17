const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const caseRoutes = require("./routes/case.routes");
const userRoutes = require("./routes/user.routes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const commentRoutes = require("./routes/comment.routes");
const timelineRoutes = require("./routes/timeline.routes");
const governmentUserRoutes =
require("./routes/government-user.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "SAMIS API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/users", userRoutes);

app.use("/api/cases", timelineRoutes);
app.use("/api/cases", commentRoutes);
app.use("/api/evidence", evidenceRoutes);

app.use(
    "/api/government-users",
    governmentUserRoutes
);
app.use(errorMiddleware);

module.exports = app;
