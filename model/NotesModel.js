const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: { type: String },
  body: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  name: { type: String },
  likes: { type: [String], default: [] },
  comments: { type: [String], default: [] },
  tags: [String],
});

const NoteModel = mongoose.model("note", noteSchema);

module.exports = NoteModel;
