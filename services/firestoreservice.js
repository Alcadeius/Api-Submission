const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

const savePrediction = async (prediction) => {
  await db.collection("predictions").doc(prediction.id).set(prediction);
};

const getAllPredictions = async () => {
  const snapshot = await db.collection("predictions").get();
  return snapshot.docs.map((doc) => doc.data());
};

module.exports = { savePrediction, getAllPredictions };
