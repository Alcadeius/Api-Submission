const express = require("express");
const bodyParser = require("body-parser");
const predictRoutes = require("./routes/predictRoutes");
// const errorHandler = require("./utils/errorHandler");

const app = express();
app.use(bodyParser.json());
app.use("/", predictRoutes);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack); // Tambahkan log error yang lebih rinci
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "fail",
    message: err.message || "Terjadi kesalahan",
    error: err, // Sertakan detail error dalam respons
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
