const express = require("express");
const router = express.Router({mergeParams: true});
const Reviews = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateReviews, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// reviews page
router.post("/",isLoggedIn, validateReviews, wrapAsync (reviewController.createReview));
  
  // delete reviews
  router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));
  
  module.exports = router;