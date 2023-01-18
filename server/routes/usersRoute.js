const express = require("express");
const utils = require("../utils.js");
const UsersModel = require("../models/UsersSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

function getId(id, next) {
  let parsedid = undefined;

  try {
    parsedid = ObjectId(id);
  } catch {
    next();
  }
  return parsedid;
}

router.post("/register", async (req, res) => {
  const { alias, password, confirmPassword } = req.body;

  UsersModel.findOne({ alias }, async (err, user) => {
    if (user) {
      res.status(400).send({ message: "alias already exists" });
      console.log("400 - alias finns redan");
    } else if (password.length <= 4) {
      res.status(401).send({ message: "password too short" });
      console.log("401");
    } else if (password !== confirmPassword) {
      res.status(402).send({ message: "passwords dont match" });
      console.log("402");
    } else {
      const newUser = new UsersModel({
        alias,
        hashedPassword: utils.hashPassword(password),
      });
      if (utils.validateAlias(newUser)) {
        await newUser.save();

        UsersModel.findOne({ alias }, (err, user) => {
          const userData = { userId: user._id, alias };
          const accessToken = jwt.sign(userData, process.env.JWTSECRET);

          res
            .cookie("rolfpeterscookie", accessToken, {
              withCredentials: true,
            })
            .json({ newUser: newUser._id, created: true, token: accessToken });
        });
      }
    }
  });
});

router.post("/login", async (req, res) => {
  console.log("tjenare mannen");
  const { alias, password } = req.body;

  const user = await UsersModel.findOne({ alias });

  if (user && utils.comparePassword(password, user.hashedPassword)) {
    const userData = { _id: user._id, alias };
    const accessToken = jwt.sign(userData, process.env.JWTSECRET);

    res.cookie("token", accessToken);
    res.status(200).send({ message: "Login success" });
  } else {
    console.log("vi får error");
    res.status(400).send({ message: "Login failed" });
  }
});

module.exports = router;
