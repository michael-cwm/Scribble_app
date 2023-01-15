require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/usersRoute");
const postRoutes = require("./routes/postsRoute");

app.get("/api", (req, res) => {
  res.send(200);
});

// app.listen(5000, () => {
//   console.log("server started on port 5000");
// });

/// MIDDLEWARE ///
app.use(
  cors({
    // origin: ["http://localhost:3000"],
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);

  next();
});

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => {
  res.send("200");
});

app.use("/users", userRoutes);
app.use("/feed", postRoutes);
// app.use("/bookings", bookingRoutes);

// CONNECT TO DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // LISTEN FOR REQUESTS
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on port http://localhost:5000/");
    });
  })
  .catch((error) => {
    console.log(error);
  });
