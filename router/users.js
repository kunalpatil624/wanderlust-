const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userControllers = require("../controllers/users.js");


router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.userSignup));

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}) ,userControllers.userLogin);

router.get("/logout", userControllers.userlogout);

module.exports = router; 