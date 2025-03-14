const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudinary.js");
const upload = multer({storage});

  
router.route("/")
.get(wrapAsync(listingControllers.index))
.post(upload.single('listing[image]'), validateListing, wrapAsync (listingControllers.createListing));

// create new rout
  router.get("/new",isLoggedIn , listingControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync (listingControllers.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync (listingControllers.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync (listingControllers.destroyListing));



//edit rout
router.get("/:id/edit" ,isLoggedIn, isOwner, wrapAsync (listingControllers.renderEditForm));

module.exports = router;