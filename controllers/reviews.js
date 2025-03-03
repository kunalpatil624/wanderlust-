const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

module.exports.createReview = async(req, res, next) => {
    let {id} = req.params;
    console.log(`${id}`);
    let listing = await Listing.findById(req.params.id);
    console.log(req.body.review.reting);
    console.log(req.body.review.comment);   //print comment
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
   
    listing.reviews.push(newReview);
    
    await listing.save();
    await newReview.save();

  req.flash("success", "review add success!");
    
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyReview = async(req, res) => {
  
    let {id, reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);

    req.flash("success", "review deleted success!");

    res.redirect(`/listings/${id}`);
  };