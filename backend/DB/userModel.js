const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

const Schema = mongoose.Schema({
  fullName: { type: String, required: [true, "fullName required"] },
  email: { type: String, required: [true, "Email required"], unique: true },
  emailVerified: { type: Boolean,default:false },
  password: { type: String ,default:'deepan31'},
  resetPassword: { type: String },
  role: { type: String, default: "user" },
  profileImg: { type: String, default: "profile.png" },
  googleId: { type: String },
});

Schema.pre("save", async function (next) {
  if (this.password) {
    const password = this.password;
    const hashpass = await bcrypt.hash(password, 10);
    this.password = hashpass;
  }
  // if(this.googleId){
  //   delete this.resetPassword;
  //   delete this.emailVerified;
  // }else{
  // this.emailVerified=false;
  // this.resetPassword =null
  // }
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
