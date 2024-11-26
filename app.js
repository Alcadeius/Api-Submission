const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const predictRoutes = require("./routes/predictRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", predictRoutes);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "fail",
    message: err.message || "Terjadi kesalahan",
    error: err,
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
