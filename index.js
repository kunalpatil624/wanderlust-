if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const Reviews = require("./models/review.js");
const Listing = require("./models/listing.js");

const { model } = require("mongoose");

const listingsRouter = require("./router/listings.js");
const reviewsRouter = require("./router/reviews.js");
const userRouter = require("./router/users.js");
const { connect } = require('http2');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()

.then((res) => {console.log("succes")})

.catch((err) => console.log(err));

async function main() {
   await mongoose.connect(process.env.ATLASDB_URL,
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
    });
}

app.listen(8080, () => {
    console.log("port is listening to 8080");
})

const store = MongoStore.create({
  secret: "kunal",
  mongoUrl: process.env.ATLASDB_URL,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SECRET
  }
})

 store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
 })

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
});

// // demo user creat
// app.get("/demouser", async(req, res) => {
//   let fakeUser = new user({
//     email: "kunalpatil@gmail.com",
//     username: "knlpvvtt",
//   });

//   let registerUser = await user.register(fakeUser, "knl123") ;
//   res.send(registerUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// error page not found
app.all("*", (req, res, next) => {
  next(new expressError(404, "PAGE NOT FOUND!"));
})

//error hendling
app.use((err, req, res, next) => {
  let {status = 404, message = "SUMTHING WANT WRONG!"} = err;
  // res.status(status).send(message);
  res.status(status).render("./listing/error.ejs", {message});
})

