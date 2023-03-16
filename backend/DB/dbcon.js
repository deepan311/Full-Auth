const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const dbcon = mongoose.connect('mongodb://localhost:27017/full-auth', {
  useNewUrlParser: true,
});

module.exports = dbcon;
