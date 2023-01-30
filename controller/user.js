const User = require("../model/user");
const bcrypt = require("bcryptjs");
const transporter = require("../middleware/transporter");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res, next) => {
  try {
    const { Name, email, password } = req.body;
    const otp = randomize("0", 6);
    const user = await User.findOne({ email });
    if (user && user.isVerified === true) {
      return res.status(400).json({ message: "Email already exists" });
    } else if (user && user.isVerified === false) {
      let mailOptions = {
        from: process.env.MY_MAIL,
        to: email,
        subject: process.env.LOGIN,
        text: `Hello, to verify your'MY-SNOUT' account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
        }
      });
      user.OTP = otp;
      user.otpExpire = Date.now() + 3600;
      await user.save();
      return res
        .status(200)
        .json({ message: "OTP sent to your email", userId: user._id });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        const user = new User({
          Name,
          email,
          password: hash,
          OTP: otp,
          otpExpire: Date.now() + 3600,
          isVerified: false,
        });
        await user.save();
        let mailOptions = {
          from: process.env.MY_MAIL,
          to: email,
          subject: process.env.LOGIN,
          text: `Hello, to verify your account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res
          .status(200)
          .json({ message: "OTP sent to your email", userId: user._id });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "15d" }
        );
        return res.status(200).json({
          message: "Login successful",
          token: token,
          userId: user._id,
        });
      }
      return res.status(400).json({ message: "Password is incorrect" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    otp = req.body.otp;
    const user = await User.findByIdAndUpdate({
      _id: req.params.userId,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    if (user.OTP === otp) {
      user.isVerified = true;
      user.OTP = "";
      user.otpExpire = "";
      await user.save();
      return res.status(200).json({ message: "Email verified successfully" });
    }
    return res.status(400).json({ message: "OTP is incorrect" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const otp = randomize("0", 6);
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    user.OTP = otp;
    user.otpExpire = Date.now() + 3600;
    await user.save();
    let mailOptions = {
      from: process.env.MY_MAIL,
      to: email,
      subject: process.env.LOGIN,
      text: `Hello, to verify your account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return res
      .status(200)
      .json({ message: "OTP sent to your email", userId: user._id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.params.adminId });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      user.password = hash;
      user.OTP = "";
      user.otpExpire = "";
      await user.save();
      let mailOptions = {
        from: process.env.MY_MAIL,
        to: user.email,
        subject: process.env.LOGIN,
        text: `Hello, to verify your account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
        }
      });
      return res.status(200).json({ message: "Password reset successfully" });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }
    const otp = randomize("0", 6);
    user.OTP = otp;
    user.otpExpire = Date.now() + 3600;
    await user.save();
    let mailOptions = {
      from: process.env.MY_MAIL,
      to: user.email,
      subject: process.env.LOGIN,
      text: `Hello, to verify your'MY-SNOUT' account here is the OTP  "${otp}". \n This otp expires in 10 minutes `,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) console.log(err);
    });
    return res
      .status(200)
      .json({ message: "OTP sent to your email", userId: user._id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
