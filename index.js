const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
// const { nextTick } = require("process");   // not sure
const { listingSchema } = require("./schema.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()

.then((res) => {console.log("succes")})

.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080, () => {
    console.log("port is listening to 8080");
})


// validate schema 
const validateSchema = (req, res, next) => {
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

app.get("/", wrapAsync(async (req, res) => {
  const  allListing = await Listing.find({});
  res.render("./listing/index.ejs", {allListing});
  // console.log(allListing);
}));

// app.get("/listing", (req, res) => {
//   const sempleListing = new Listing({
//     titel: "goa bietch",
//     discription: "this bietch are very cool",
//     image: "https://in.images.search.yahoo.com/search/images;_ylt=AwrKCcmkpUBnfQIA8QO7HAx.;_ylu=Y29sbwNzZzMEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=goa+beaches&fr2=piv-web&type=E210IN826G0&fr=mcafee#id=11&iurl=https%3A%2F%2Fvoiceofadventure.com%2Fwp-content%2Fuploads%2F2022%2F06%2F60d0813807aff-Baga_Beach_In_Goa.jpg&action=click",
//     price: 1200,
//     location: "goa",
//     country: "india"
//   });

//   sempleListing.save();
//   console.log("add success");
//   res.send("add success");
// })

// show rout
app.get("/listings/:id", wrapAsync (async (req, res) => {
  let {id} = req.params;
  let listingData = await Listing.findById(id)
  res.render("./listing/show.ejs", {listingData});
}));

// index rout
app.get("/listings", wrapAsync (async (req, res, next) => {

    const  allListing = await Listing.find({});
   res.render("./listing/index.ejs", {allListing});
  //  console.log(allListing);
})
);

// create new rout
app.get("/listing/new", (req,res) => {
  res.render("./listing/new.ejs");
})

//add new liating rout
app.post("/listings", validateSchema, wrapAsync (async (req, res, next) => {
    // let {title, description, image, price, location, country} = req.body;
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit rout
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
  let {id} = req.params;
  let listingData = await Listing.findById(id)
  res.render("./listing/edit.ejs", {listingData});
}));

//updaite rout
app.put("/listings/:id", validateSchema, wrapAsync (async (req, res) => {

  // if(!req.body.Listing){
  //   throw new expressError(400, "plesa send valid data!");
  // }
  
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {... req.body.listing});
  res.redirect(`/listings/${id}`);
}));

// delete rout
app.delete("/listings/:id", wrapAsync (async (req, res) => {
  let {id} = req.params;
  console.log(id);
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

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