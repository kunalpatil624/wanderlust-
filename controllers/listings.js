const Listing = require("../models/listing");

module.exports.index = (async (req, res, next) => {
  
    const  allListing = await Listing.find({});
   res.render("./listing/index.ejs", {allListing});
  //  console.log(allListing);
});

module.exports.renderNewForm = (req,res) => {
    res.render("./listing/new.ejs");
  };

  module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, location, country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
  let listing = req.body.listing;
  const newListing = new Listing(listing); 
  console.log(req.user);
  newListing.owner = req.user;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "user add success!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    let listingData = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");

    console.log(listingData.owner);
    
    if(!listingData){
      req.flash("error", "listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("./listing/show.ejs", {listingData}, );
  };

  module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listingData = await Listing.findById(id)
  
    if(!listingData){
      req.flash("error", "listing you requested for does not exist!");
      res.redirect("/listings");
    }
    
    let originalImageUrl = listingData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", ("/upload/w_250"));
    res.render("./listing/edit.ejs", {listingData, originalImageUrl});
  };

  module.exports.updateListing = async (req, res) => {

  
    let {id} = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, {... req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};    
        await newListing.save();
    }

    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "user deleted success!");
    res.redirect("/listings");
  };