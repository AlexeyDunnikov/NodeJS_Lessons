const { Router } = require("express");
const { validationResult } = require("express-validator");
const Course = require("../models/course");
const { courseValidators } = require("../utils/validators");
const auth = require("../middleware/auth");
const router = Router();

function isOwner(course, req){
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  const courses = await Course.find().populate("userId", "email name");

  res.render("courses", {
    title: "Курсы",
    isCourses: true,
    courses,
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id);

  res.render("course-edit", {
    title: `Change ${course.title}`,
    course,
  });
});

router.post("/edit", auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  const { id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/couses/${id}/edit?allow=true`);
  }

  try {
    delete req.body.id;
    const course = await Course.findByIdAndUpdate(id);
    if (isOwner(course, req)){
      return res.redirect('/courses');
    }
    Object.assign(course, req.body);
    await course.save();
    res.redirect("/courses");
  } catch (err) {
    console.log(err);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect("/courses");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
  });
});

module.exports = router;
