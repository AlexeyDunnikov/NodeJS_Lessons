const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require('express-session');
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require("./models/user");
const varMiddleware = require('./midlware/variables')

const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("61baf4bc3f36398550de9a73");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
}));
app.use(varMiddleware);

//Registration rotes
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `mongodb+srv://Alexey:Jr7RTFqcyHei6gyh@cluster0.bersp.mongodb.net/shop`;
    await mongoose.connect(url, { useNewUrlParser: true });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "dunnikov223@gmail.com",
        name: "Alexey",
        cart: {
          items: [],
        },
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
}

start();
