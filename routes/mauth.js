const express = require("express");
const otp = require("../mails/otp");
const sendmail = require("../mails/authmail");
const router = express.Router();
const Muser = require("../models/Muser");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_sec = "thisisprtiamkuamrmauryaandmy";
router.post(
  "/mcreateuser",
  [
    body("email", "enter right mail").isEmail(),
    body("password", "enter valid password").isLength({ min: 5 }),
    body("name", "name should be more than 3 chars").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      console.log(req.body);
      let user = await Muser.findOne({ email: req.body.email });
      if (user) {
        console.log(user);
        return res.status(405).json({ error: "sorry user is already exist." });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      let token = "";
      for (let i = 0; i < 4; i++) {
        token += Math.floor(Math.random() * 10);
      }
      user = await Muser.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        confirmationCode: token,
      });
      const jwtData = jwt.sign({ useridis: user._id }, JWT_sec);
      console.log(jwtData, user._id);
      res.status(200).json({msg:true});
      otp(req.body.email, "Sign up Otp", token);
    } catch (error) {
      res.status(500).send("Some error occured.");
    }
  }
);
router.post(
  "/verify",
  [
    body("otp", "Enter valid otp").isLength(4),
    body("email", "enter right mail").isEmail(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { otp, email } = req.body;
    try {
      let user = await Muser.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ error: "please login with valid email." });
      }
      console.log(user.confirmationCode);

      if (otp !== user.confirmationCode) {
        return res.status(402).json({ error: "please login with valid otp." });
      }
      let token = "";
      for (let i = 0; i < 4; i++) {
        token += Math.floor(Math.random() * 10);
      }
      console.log(token);
      user = await Muser.findOneAndUpdate(
        { email: email },
        { $set: { status: "Active", confirmationCode: token } },
        { new: true }
      );

      sendmail(email, "Cloud book", "Your account has been activated.");
      res.status(200).json({ sucsses: true, message: "account activated succssesfull." });
      console.log(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured.");
    }
  }
);

router.post(
  "/resend",
  [
    body("email", "enter right mail").isEmail(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { email } = req.body;
    try {
      let user = await Muser.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "please give valid email." });
      }
      let token = "";
      for (let i = 0; i < 4; i++) {
        token += Math.floor(Math.random() * 10);
      }
      user = await Muser.findOneAndUpdate(
        { email: email },
        { $set: {confirmationCode: token } },
        { new: true }
      );
      otp(email, "Forgot password Otp", token);
      res.status(200).json({ sucsses: true, message: "Otp has been sent." });
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured.");
    }
  }
);


router.post(
  "/login",
  [
    body("email", "enter right mail").isEmail(),
    body("password", "password can not be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await Muser.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "please login with valid email id or password." });
      }
      if (user.status != "Active") {
        return res.status(401).send({
          msg: "Pending Account. Please Verify Your Email!",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(401)
          .json({ msg: "please login with valid email id or password." });
      }
      const jwtData = jwt.sign({ useridis: user._id }, JWT_sec);
      console.log(jwtData)
      const de = jwt.verify(jwtData, JWT_sec);
      res.status(200).json({ msg: true, jwtData, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ msg: "Some error occured." });
    }
  }
);
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.useridis;
    const user = await Muser.findById(userId).select("-password");
    if (user && user.status != "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured.");
  }
});
router.post(
  "/forpass",
  [
    body("email", "enter right mail").isEmail(),
    body("password", "enter valid password").isLength({ min: 5 }),
    body("otp", "Enter valid otp").isLength({min:4, max:4})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await Muser.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ error: "please login with valid email id or password." });
      }
      if (user.status !== "Active") {
        return res.status(402).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
      if (req.body.otp !== user.confirmationCode) {
        return res.status(403).json({ error: "please login with valid otp." });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      let token = "";
      for (let i = 0; i < 4; i++) {
        token += Math.floor(Math.random() * 10);
      }
      user = await Muser.findOneAndUpdate(
        { email: email },
        { $set: { password: secPass, confirmationCode: token } },
        { new: true }
      );
      
      otp(email, "Password changed", "Password changed.");
      res.status(200).send({ message: "Password changed." });
      return;
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: "Some error occured" });
    }
  }
);
module.exports = router;
