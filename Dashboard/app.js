const path = require("path");

const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const db = require("./data/database");
const authRoutes = require("./routes/auth");

const mongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new mongoDBStore({
  uri: "mongodb://127.0.0.1:27017",
  databaseName: "minor-project-2",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    // cookie: {
    //   maxAge: 30 * 24 * 60 * 60 * 1000
    // }
  })
);

app.use(async function (req, res, next) {
  const isAuth = req.session.isAuthenticated;

  if (!isAuth) {
    return next();
  }

  res.locals.isAuth = isAuth;

  next();
});

app.use(authRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
