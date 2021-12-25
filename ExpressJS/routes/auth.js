const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
const { registerValidators, loginValidators } = require("../utils/validators");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Authorization",
    isLogin: true,
    loginError: req.flash("loginError"),
    regError: req.flash("regError"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("regError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#login");
    }

    const areSame = await bcrypt.compare(password, candidate.password);
    if (areSame) {
      const user = candidate;
      req.session.user = user;
      req.session.isAuthenticated = true;
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        res.redirect("/");
      });
    } else {
      req.flash("loginError", "Неверный пароль");
      res.redirect("/auth/login#login");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/registration", registerValidators, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("regError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#registration");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: {
        items: [],
      },
    });
    await user.save();
    res.redirect("/auth/login#login");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
