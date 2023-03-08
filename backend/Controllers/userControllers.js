const User = require("../DB/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const multer = require("../multer");
const upload = require("../multer");
const path = require("path");
const fs = require("fs");
const SECRET_KEY = "DEEPAN";

const jsonData = (condition, msg, result = null) => {
  return { status: condition, msg, result };
};

const ResetPasswordMailSend = async (email) => {
  return new Promise(async (resolve, reject) => {
    const result = await User.findOne({ email }).select("-password");

    if (!result) {
      return reject("User No Found");
    }

    const token = await jwt.sign({ email: result.email }, SECRET_KEY, {
      expiresIn: "10m",
    });

    const update = await User.findOneAndUpdate(
      { email: result.email },
      { resetPassword: token }
    );

    if (!update) {
      reject("token no create Somthing Wrong");
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "deep.developer.31@gmail.com",
        pass: "attmfomifbjfydeg",
      },
    });

    const compose = {
      from: "deep.developer.31@gmail.com",
      to: result.email,
      subject: "Click to Reset your Password",
      html: `${process.env.CLIENT_URL}/reset-password/${token}`,
    };

    transport.sendMail(compose, (err, doc) => {
      if (err) {
        return reject(err);
      }
      resolve(doc);
    });
  });
};

const VerifiedMailSend = async (email) => {
  return new Promise(async (resolve, reject) => {
    const token = await jwt.sign({ email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "deep.developer.31@gmail.com",
        pass: "attmfomifbjfydeg",
      },
    });

    const compose = {
      from: "deep.developer.31@gmail.com",
      to: email,
      subject: "Click to verify Email",
      html: `${process.env.CLIENT_URL}/verify-email/${token}`,
    };

    transport.sendMail(compose, (err, doc) => {
      if (err) {
        return reject(err); 
      }
      resolve(doc);
    });
  });
};

exports.getProfileImage = async (req, res) => {
  const id = req.id;

  if (!id) {
    return res.status(401).json(jsonData(false, "id no provide"));
  }

  try {
    const result = await User.findById(id);

    if(result.profileImg === 'profile.png'){
    const filePath = path.join(__dirname, "../", 'profile.png');
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(401).json(jsonData(false, "sendFile Error", err));
      }
    });
    return res.status(200);

    }else{
      const filePath = path.join(__dirname, "../", result.profileImg);
  
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(401).json(jsonData(false, "sendFile Error", err));
        }
      });
      return res.status(200);
    }

   
  } catch (error) {
    res.status(401).json(jsonData(false, "Fetch image Error", error));
  }
};

exports.getAllData = async (req, res) => {
  const id = req.id;

  if (!id) {
    return res.status(401).send(jsonData(false, "Token No Found"));
  }

  const oneUser = await User.findById(id);

  if (oneUser.role === "admin") {
    const FetchAlldata = await User.find();

    res.status(200).send(FetchAlldata);
  } else {
    return res
      .status(401)
      .send(jsonData(false, "You could not Access All Data", oneUser.email));
  }
};

// exports.getData = async (req, res) => {
//   const id = req.id;
//   try {
//     console.log(id);
//     if (!id) {
//       return res.status(401).send(jsonData(false, "Token No Found"));
//     }

//     const result = await User.findById(id);

//     if (!result) {
//       return res.status(401).send(jsonData(false, "No Fetch data", result));
//     } else {
//       const filePath = path.join(__dirname, "../", result.profileImg);
//       console.log(filePath);
//       // console.log(file)
//       res.sendFile(filePath, (err) => {
//         if (err) {
//           return res.status(400).json(jsonData(false, "sendFile Error", err));
//         }
//         console.log("Successfully");
//       });
//       return res.json(jsonData(true, "All Data Fetch Successfully",result));
//     }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

exports.getData = async (req, res) => {
  const id = req.id;
  try {
    if (!id) {
      return res.status(401).send(jsonData(false, "Token No Found"));
    }

    const result = await User.findById(id).select("-password");

    if (!result) {
      return res.status(401).send(jsonData(false, "No Fetch data", result));
    } else {

      res.json(jsonData(true, "All Data Fetch Successfully", result));
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.signUp = async (req, res) => {
  try {
    const { fullName, email, password, cpassword } = req.body;
    if (!fullName || !email || !password || !cpassword) {
      return res.status(500).send(jsonData(false, "provide valid details"));
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(500)
        .send(
          jsonData(
            false,
            "This User Aldready Registered go to Login",
            existUser.email
          )
        );
    }
    if (password != cpassword) {
      return res.status(500).send(jsonData(false, "Password Not match"));
    }
    const result = await User.create({
      fullName,
      email,
      password,
    });

    if (result) {
      VerifiedMailSend(result.email)
        .then((doc) => {
          res
            .status(200)
            .send(
              jsonData(
                true,
                `The Verified Link has been send Successfully ${doc.accepted}`,
                result.email
              )
            );
        })
        .catch((err) => {
          res.status(400).send(jsonData(false, "Email Could not Send", err));
        });
    } else {
      return res.status(400).send(jsonData(false, "User Not  Create", error));
    }
  } catch (error) {
    return res.status(500).send(jsonData(false, "Somthing Wrong", error));
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res
      .status(400)
      .json(jsonData(false, "No User Found please Registered", foundUser));
  }

  const matchPassword = await bcrypt.compare(password, foundUser.password);

  if (matchPassword) {
    const token = await jwt.sign({ id: foundUser._id }, SECRET_KEY, {
      expiresIn: "30m",
    });
    return res.status(200).send(jsonData(true, "signIn Successfully", token));
  } else {
    return res.status(400).json(jsonData(false, "password Wrong", password));
  }
};

exports.updateUser = async (req, res) => {
  const id = req.id;

  if (!id) {
    return res.status(401).send(jsonData(false, "Token No Found"));
  }

  const updateObj = () => {
    const { email, fullName } = req.body;
    const obj = {};
    if (email) {
      obj.email = email;
    }
    if (fullName) {
      obj.fullName = fullName;
    }
    return obj;
  };

  const upobj = updateObj();

  const result = await User.findByIdAndUpdate(id, upobj).select("-password");

  if (result) {
    res.status(200).send(jsonData(true, "User Update Successfully", result));
  } else {
    res.status(500).send(jsonData(false, "User Update failed  "));
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res.status(401).send(jsonData(false, "Token No Found"));
  }

  const { password } = req.body;

  if (!password) {
    return res.status(401).send(jsonData(false, "password no provide"));
  }

  const userfound = await User.findById(id);

  if (!userfound) {
    return res.status(400).send(jsonData(false, " User Not Found"));
  }

  const match = await bcrypt.compare(password, userfound.password);

  if (match) {
    const delUser = await User.findByIdAndDelete(id);
    if (delUser) {
      return res.status(200).send(jsonData(true, "UserDelete Successfully"));
    } else {
      return res.status(400).send(jsonData(false, " User Not Found"));
    }
  } else {
    res.status(401).send(jsonData(false, "password Wrong"));
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    await jwt.verify(token, SECRET_KEY, async (err, doc) => {
      if (err) {
        return res.status(400).send(jsonData(false, "Token Expired"));
      }
      const result = await User.findOneAndUpdate(
        { email: doc.email },
        { emailVerified: true }
      );
      if (result) {
        res.status(200).send(jsonData(true, "email hasbeen verified", doc));
      }
    });
  } catch (error) {
    return res.status(500).send(jsonData(false, "Somthing Wrong", error));
  }
};

exports.resendVerfiEmail = async (req, res) => {
  const { email } = req.params;
  const dbresult = await User.findOne({ email });
  if (dbresult.emailVerified) {
    return res
      .status(400)
      .json(jsonData(true, "This Email Aldreay Verified", email));
  }
  if (dbresult) {
    VerifiedMailSend(dbresult.email)
      .then((doc) => {
        res
          .status(200)
          .send(
            jsonData(
              true,
              `The Verified Link has been send Successfully ${doc.accepted}`,
              dbresult.email
            )
          );
      })
      .catch((err) => {
        res.status(400).send(jsonData(false, "Email Could not Send", err));
      });
  } else {
    return res.status(400).send(jsonData(false, "User Not  Create", error));
  }
};

exports.updateProfileImg = async (req, res) => {
  try {
    const id = req.id;
    const dbresult = await User.findById(id).select("-password");

    const uploadhandle = upload.single(dbresult.email);
    uploadhandle(req, res, async (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .send(jsonData(false, "File Size should be less then 2 MB"));
        }
        return res.status(400).send(jsonData(false, "Server Error", err));
        
      } else {

        if (dbresult.profileImg!='profile.png') {
          const filename = path.join(__dirname, "../", dbresult.profileImg);
          fs.unlink(filename ,err=>{
            if(err) return res.status(400).send('delete error') 
          });
        } 
  
        const fileDetails = req.file;

        // return res.send(fieldname)
        const updatedb = await User.findByIdAndUpdate(id, {
          profileImg: fileDetails.path,
        });
        if (!updatedb) {
          return res.status(400).send(jsonData(false, "DB Update fasle"));
        }
 
      
        return res
          .status(200)
          .send(jsonData(true, "Image upload Successfully", updatedb));
      }
    });
  } catch (error) {
    return res
      .status(400)
      .send(jsonData(false, "Profile Could not update", error));
  }
};

// ==========================RESET PASSWORD===========================

exports.forgotPasword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("email no provide");
  }

  ResetPasswordMailSend(email)
    .then((doc) => {
      res
        .status(200)
        .send(jsonData(true, "Reset Link has send Successfully yor mail", doc));
    })
    .catch((err) => {
      return res.status(500).send(jsonData(false, `Error : ${err}`, err));
    });
};

exports.updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(500).send(jsonData(true, "token or password no provide"));
  }

  try {
    await jwt.verify(token, SECRET_KEY, async (err, doc) => {
      if (err) {
        return res.status(400).send(jsonData(false, "Token Expired"));
      }
      const result = await User.findOne({ email: doc.email });
      if (!result) {
        res.status(200).send(jsonData(true, "No Email Found", doc));
      }

      jwt.verify(result.resetPassword, SECRET_KEY, async (err, doc) => {
        if (err) {
          return res.status(400).send(jsonData(false, "Token Expired Retry"));
        }
        const updatePassword = await User.findOneAndUpdate(
          { email: doc.email },
          { password: newPassword, resetPassword: null }
        );
        if (!updatePassword) {
          return res.status(400).send(jsonData(false, "Update Password Fail"));
        }
        res
          .status(200)
          .send(jsonData(true, "Password Updated", updatePassword.email));
      });
    });
  } catch (error) {
    return res.status(500).send(jsonData(false, "Somthing Wrong", error));
  }
};

exports.passlink = async (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, (err, doc) => {
    if (err) {
      return res.status(400).send(jsonData(false, "Token Expired"));
    }
    return res.status(200).send(jsonData(true, "Link Pass", token));
  });
};

// ==========================MIDDLEWARE===========================

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(400).send(jsonData(false, "No Token provide"));
  }

  jwt.verify(token, SECRET_KEY, (err, doc) => {
    if (err) {
      if (err.message) {
        return res.status(500).send(jsonData(false, "Token Expired"));
      }
      return res.status(500).send(jsonData(false, "token error", err));
    }
    req.id = doc.id;
    next();
  });
};

// exports.emailSend = async (req, res) => {
//   VerifiedMailSend("deepanraj")
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       res.status(400).send(jsonData(false, "email Not valid", err));
//     });
// };
