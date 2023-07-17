const express = require("express");
const noteRouter = express.Router();
const NoteModel = require("../model/NotesModel");

noteRouter.get("/", async (req, res) => {
  const notes = await NoteModel.find();
  res.send(notes);
});

// by query
/*noteRouter.get("/note", async (req, res) => {
  try {
    const notes = await NoteModel.find(req.query);
    res.send(notes);
  } catch (error) {
    res.send({ msg: "oops cannot get the note" });
  }
});*/
noteRouter.get("/search", async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const title = new RegExp(searchQuery, "i");
    const notes = await NoteModel.find({ title });
    return res.status(200).send(notes);
  } catch (error) {
    res.send({ msg: "oops cannot get the note" });
  }
});

//by query params
noteRouter.get("/note/:id", async (req, res) => {
  const noteId = req.params.id;
  try {
    const notes = await NoteModel.find({ _id: noteId });
    res.send(notes);
  } catch (error) {
    res.send({ msg: "oops cannot get the note" });
  }
});

noteRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const note = await NoteModel.create({
      ...payload,
      creator: req.userId,
      name: req.name,
    });
    await note.populate("creator");
    return res.status(201).send({ msg: "new note has been created", note });
  } catch (error) {
    res.send({ msg: "unable to create new note", error: error.message });
  }
});

//update by patch

noteRouter.patch("/update/:id", async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.id);
    if (note.creator.toString() !== req.userId) {
      res.send("You are not authorized to update this note");
    } else {
      const updatedNote = await NoteModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.send({ msg: "note has been updated", updatedNote });
    }
  } catch (error) {
    res.send({ msg: "unable to update note", error: error.message });
  }
});
//delete
noteRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const note = await NoteModel.findOne({ _id: id });
  try {
    if (req.body.userId === note.userId) {
      await NoteModel.findByIdAndDelete({ _id: id });
      res.send({ msg: "note has been deleted" });
    } else {
      res.send({ msg: "You cannot delete this note.Try again later!" });
    }
  } catch (error) {
    res.send({ msg: "note cannot be deleted" });
  }
});

//likes update
noteRouter.patch("/like/:postId", async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.postId);
    const index = note.likes.findIndex((id) => id === String(req.userId));
    if (index == -1) {
      note.likes.push(req.userId);
    } else {
      note.likes = note.likes.filter((id) => id !== String(req.userId));
    }
    const updatedNote = await NoteModel.findByIdAndUpdate(
      req.params.postId,
      note,
      {
        new: true,
      }
    );
    res.send(updatedNote);
  } catch (error) {
    res.send({ msg: "unable to update note", error: error.message });
  }
});

//comments

noteRouter.patch("/comments/:postId", async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.postId);
    // console.log(note.comments);
    note.comments.push(req.userId);
    const updatedNote = await NoteModel.findByIdAndUpdate(
      req.params.postId,
      note,
      {
        new: true,
      }
    );
    res.send(updatedNote);
  } catch (error) {
    res.send({ msg: "unable to update note", error: error.message });
  }
});

module.exports = noteRouter;
