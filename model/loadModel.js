const tf = require("@tensorflow/tfjs-node");
const { errorHandler } = require("../utils/errorHandler");
require("dotenv").config();

let model;

const loadModel = async () => {
  if (!model) {
    try {
      const modelUrl =
        "https://storage.googleapis.com/ml-submission/model-ml/model.json";
      model = await tf.loadGraphModel(modelUrl);
    } catch (err) {
      throw new Error("Gagal memuat model");
    }
  }
  return model;
};

const predictImage = async (model, imageBuffer) => {
  try {
    const imageTensor = tf.node
      .decodeImage(imageBuffer)
      .resizeBilinear([224, 224])
      .expandDims();
    const prediction = model.predict(imageTensor);
    const result = prediction.dataSync()[0] > 0.5 ? "Cancer" : "Non-cancer";
    return result;
  } catch (err) {
    throw errorHandler(err, 400, "Kesalahan prediksi");
  }
};

module.exports = { loadModel, predictImage };
