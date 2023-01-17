const express = require("express");
const utils = require("../utils.js");
const UsersModel = require("../models/UsersSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

// Id function \\
function getId(id, next) {
  let parsedid = undefined;

  try {
    parsedid = ObjectId(id);
  } catch {
    next();
  }
  return parsedid;
}

// const createToken = (id) => {
//   return jwt.sign({ id }, "JWTSECRET", { expiresIn: "1h" });
// };

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

          // const token = createToken(newUser._id);
          res
            .cookie("rolfpeterscookie", accessToken, {
              withCredentials: true,
            })
            .json({ newUser: newUser._id, created: true, token: accessToken });
        });

        // console.log(token);

        // res.cookie("jwt", token, {
        //   withCredentials: true,
        //   httpOnly: false,
        // });

        // await UsersModel.findOne({ alias }),
        //   (err, user) => {
        //     const token = jwt.sign(user, process.env.JWTSECRET, {
        //       expiresIn: "1h",
        //     });

        //     res.cookie("token", token);
        //   };

        // res.send(200, "account created!");

        // .json({ newUser: newUser._id, created: true, token: token });
        // res
        //   .status(201)
        //   .json({ newUser: newUser._id, created: true, token: token });
      }
    }
  });

  //   res.status(409, "user already exists");
  // } else {
  // const newUser = new UsersModel({
  //   alias,
  //   hashedPassword: utils.hashPassword(password),
  // });
  // newUser.save();
  // }
});

// router.post("/register", (req, res) => {
//   const { alias, password, confirmPassword } = req.body;

//   UsersModel.findOne(alias),
//     async (err, user) => {
//       if (user) {
//         res.status(400).send({ message: "Login success" });
//       } else if (password.length <= 4) {
//         res.status(401, {
//           error: "Your password must have at least 5 characters",
//         });
//       } else if (password !== confirmPassword) {
//         res.render("users/user-register", {
//           error: "Passwords don't match",
//         });
//       } else {
//         const newUser = new UsersModel({
//           alias,
//           hashedPassword: utils.hashPassword(password),
//         });
//         if (utils.validateAlias(newUser)) {
//           await newUser.save();

//           UsersModel.findOne({ alias }, (err, user) => {
//             const userData = { userId: user._id, alias };
//             const accessToken = jwt.sign(userData, process.env.JWTSECRET);

//             res.cookie("token", accessToken);
//             res.send(200);
//           });
//         }
//       }
//     };
// });

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
