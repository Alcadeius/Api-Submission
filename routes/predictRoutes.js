const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { loadModel, predictImage } = require("../model/loadModel");
const {
  savePrediction,
  getAllPredictions,
} = require("../services/firestoreservice");
const { errorHandler, errHandler } = require("../utils/errorHandler");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
}).single("image");

// Gunakan middleware upload di dalam router dan tangani error secara manual
router.post("/predict", (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
    }
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "fail",
          message: "No file uploaded",
        });
      }

      const model = await loadModel();
      const result = await predictImage(model, req.file.buffer);
      const id = uuidv4();
      const createdAt = new Date().toISOString();

      const prediction = {
        id,
        result: result === "Cancer" ? "Cancer" : "Non-cancer",
        suggestion:
          result === "Cancer"
            ? "Segera periksa ke dokter!"
            : "Penyakit kanker tidak terdeteksi.",
        createdAt,
      };

      await savePrediction(prediction);

      res.status(201).json({
        status: "success",
        message: "Model is predicted successfully",
        data: prediction,
      });
    } catch (err) {
      next(errorHandler(err));
    }
  });
});

// Endpoint GET /predict/histories
router.get("/predict/histories", async (req, res, next) => {
  try {
    const predictions = await getAllPredictions();
    res.status(200).json({
      status: "success",
      message: "Histories retrieved successfully",
      data: predictions,
    });
  } catch (err) {
    next(errHandler(err));
  }
});

module.exports = router;
