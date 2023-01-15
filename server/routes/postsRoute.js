const express = require("express");
const utils = require("../utils.js");
const PostModel = require("../models/PostModel");
const UsersModel = require("../models/UsersSchema");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/posts", async (req, res) => {
  // const getPosts = await PostModel.find();
  // res.send(getPosts);
  const getPosts = await PostModel.find().sort({ createdAt: -1 });
  res.send(getPosts);
});

router.post("/posts", (req, res) => {
  const cookie = req.body.token;
  const tokenData = jwt.decode(cookie, process.env.JWTSECRET);
  const { postContent } = req.body;

  const newPost = new PostModel({
    content: postContent,
    time: new Date(),
    author: tokenData.alias.toString(),
    votes: 0,

    // ...req.body,
    // writtenBy: "rolfpeter",
  });
  newPost.save();
  res.status(200).json({ newPost });
});

router.post("/upvote/:id", async (req, res) => {
  const scribbleId = req.params.id;

  const getScribble = await PostModel.findById({ _id: scribbleId });

  let scribbleVotes = getScribble.votes;

  // console.log(scribbleVotes);

  const theScribble = await PostModel.findOneAndUpdate(
    { _id: scribbleId },
    { $set: { votes: (scribbleVotes += 1) } }
  );
  if (theScribble) {
    res.status(200).json(theScribble);
  }
});

router.post("/downvote/:id", async (req, res) => {
  const scribbleId = req.params.id;

  const getScribble = await PostModel.findById({ _id: scribbleId });

  let scribbleVotes = getScribble.votes;

  const theScribble = await PostModel.findOneAndUpdate(
    { _id: scribbleId },
    { $set: { votes: (scribbleVotes -= 1) } }
  );
  if (theScribble) {
    res.status(200).json(theScribble);
  }
});

router.post("/downvote/comment/:id", async (req, res) => {
  const commentId = req.params.id;

  const getComments = await PostModel.findOne({ "comments._id": commentId });

  // console.log(getComments.comments[1].content);
  // console.log(getComments?.comments[0]?.content);

  getComments.comments.forEach((comment) => {
    if (comment._id.toString() === commentId) {
      comment.votes--;
      console.log(comment);
    }
  });

  getComments.save();

  res.status(200).json(getComments);

  // getCommentId.save();
});

router.post("/upvote/comment/:id", async (req, res) => {
  console.log("vaa?");

  const commentId = req.params.id;

  const getComments = await PostModel.findOne({ "comments._id": commentId });

  getComments.comments.forEach((comment) => {
    if (comment._id.toString() === commentId) {
      comment.votes++;
      console.log(comment);
    }
  });

  getComments.save();

  res.status(200).json(getComments);
});

router.get("/posts/:id", async (req, res) => {
  const scribbleId = req.params.id;

  const scribble = await PostModel.findById({ _id: scribbleId });
  console.log("win ");
  if (scribble) {
    res.status(200).json(scribble);
    // console.log(scribble);
  }
});

router.post("/posts/comment/:id", async (req, res) => {
  const scribbleId = req.params.id;

  const { commentObject } = req.body;
  const { cookie } = req.body;
  const tokenData = jwt.decode(cookie, process.env.JWTSECRET);

  commentObject.author = tokenData.alias;

  // const scribble = await PostModel.findByIdAndUpdate(
  //   { _id: scribbleId },
  //   { $set: { comments: commentObject } }
  // );

  const scribble = await PostModel.findById({ _id: scribbleId });

  scribble.comments.push(commentObject);

  scribble.save();

  // console.log(scribble);
  if (scribble) {
    res.status(200).json(scribble);
  }
});

// router.post("/downvote/comment/:id", async (req, res) => {
//   const commentId = req.params.id;

//   await PostModel.find({ "comments._id": commentId }, (err, posts) => {
//     posts.forEach((post) => {
//       post.comments.forEach((comment) => {
//         if (comment._id.toString() === commentId) {
//           console.log("tjenare manne");
//         }
//       });
//     });
//   });
// });

module.exports = router;
