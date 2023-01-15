const { MongoUnexpectedServerResponseError } = require("mongodb");
const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  content: { type: "String", required: true },
  time: { type: "Number", default: Date.now() },
  // author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  author: { type: "String", ref: "Users", required: true },
  votes: { type: "Number", default: 0 },
  createdAt: { type: "Date", default: Date.now() },
  comments: [
    {
      content: { type: "String" },
      time: { type: "Number", default: Date.now() },
      author: { type: "String", ref: "Users", required: true },

      votes: { type: "Number", default: 0 },
    },
  ],
});
// writtenBy: { type: Schema.Types.ObjectId, ref: Users, required: true },
// writtenBy: { type: Schema.Types.ObjectId, required: true },

const PostModel = model("Posts", postSchema);

module.exports = PostModel;
