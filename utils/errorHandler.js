const errorHandler = (
  err,
  status = 400,
  message = "Terjadi kesalahan dalam melakukan prediksi"
) => {
  err.status = status;
  err.message = message;
  return err;
};
const errHandler = (err, status = 500, message = "Terjadi kesalahan") => {
  err.status = status;
  err.message = message;
  return err;
};
module.exports = { errorHandler, errHandler };
