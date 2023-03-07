const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require('path')

const Schema = mongoose.Schema({
  fullName: { type: String, required: [true, "fullName required"] },
  email: { type: String, required: [true, "Email required"], unique: true },
  emailVerified: { type: Boolean, default: false },
  password: { type: String, required: [true, "Password required"] },
  resetPassword: { type: String, default: null },
  role: { type: String, default: "user" },
  profileImg:{type:String,default:'profile.png'}
});

Schema.pre("save", async function (next) {
  const password = this.password;
  const hashpass = await bcrypt.hash(password, 10);
  this.password = hashpass;
  next();
});

Schema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const password = update.password;
    const hashpass = await bcrypt.hash(password, 10);
    update.password = hashpass;
  }

  next();
});

const User = mongoose.model("user-Datas", Schema);

module.exports = User;
