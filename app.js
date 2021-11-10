if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");

const userRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const reviewsRoutes = require("./routes/reviews");
const MongoStore = require("connect-mongo");

const dbUrl = "mongodb://localhost:27017/anythingsell";
// const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const port = 8080;
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store =  MongoStore.create({
  mongoUrl: dbUrl,
  secret: "secret",
  touchAfter: 24 * 60 * 60
})

store.on("error", function (e){
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  name: 'session',
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/", userRoutes);
app.use("/products", productsRoutes);
app.use("/products/:id/reviews", reviewsRoutes);

app.get("/", function (req, res) {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong!!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Serving on https://localhost:${port}`);
});

