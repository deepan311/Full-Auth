const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const dbcon = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
});

module.exports = dbcon;
