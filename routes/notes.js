const express = require("express");
//we will use this fetchuser becasuse user should be logged in. that will verify by token
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Noteschema = require("../models/Note"); 
const { body, validationResult } = require("express-validator");
//an end point for fetching all the notes

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  //every thing will be wrap up in try and catch beacuse there will be error from our side
  try {
    //finding the notes using user id which is embeded with schema of user from model
    const note = await Noteschema.find({ user: req.user.useridis }).sort("-date");
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured.");
  }
});

//adding note notes to data base
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 charecters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //validation checking if there are error  the return bad request
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Noteschema({
        title,
        description,
        tag,
        user: req.user.useridis,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured.");
    }
  }
);
//update existing note using put
router.put("/udatenote/:id", fetchuser, async (req, res) => {
  //here fetchuser decide this note is of real person
  try {
    const { title, description, tag } = req.body;
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    newnote.seen = false;
    newnote.date = Date.now()
    //find the note to be uptdated and update it
    //const note = Noteschema.findByIdAndUpdate()
    //here real user can change any one's note

    let note = await Noteschema.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    if (note.user.toString() !== req.user.useridis) {
      return res.status(401).send("not allowed");
    }
    note = await Noteschema.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured.");
  }
});
//delet the note existing note using put
router.delete("/deletnote/:id", fetchuser, async (req, res) => {
  //here fetchuser decide this note is of real person
  try {
    let note = await Noteschema.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    if (note.user.toString() !== req.user.useridis) {
      return res.status(401).send("not allowed");
    }
    note = await Noteschema.findByIdAndDelete(req.params.id);
    res.send("deleted sucssessfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured.");
  }
});
//set note is seen
router.post("/seennote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Noteschema.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    if (note.user.toString() !== req.user.useridis) {
      return res.status(401).send("not allowed");
    }
    let p = !(note.seen)
    console.log(p)
    note = await Noteschema.findByIdAndUpdate(
      req.params.id,
      { $set: { seen: p } },
      { new: true }
    );
    res.send("seen")
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured.");
  }
});
module.exports = router;
