const Listing = require("./models/listing.js");
const Reviews = require("./models/review.js");
const { listingSchema, reviewsSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;
        console.log(req.originalUrl);

        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
    
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing && !listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Reviews.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "you are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    else{
      next();
    }
  }

  module.exports.validateReviews = (req, res, next) => {
    let {error} = reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    else{
      next();
    }
  }