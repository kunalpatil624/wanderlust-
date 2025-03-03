const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviews = require("./review.js");

const listingSchema = new Schema({
    title: {
        type : String,
        require: true
    },

    description: String,

    image: {
      url: String,
      filename: String,
      },

      
    price: Number,
    location: String,
    country: String,

    reviews: [
     {
      type: Schema.Types.ObjectId,
      ref: "reviews"
     },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  await reviews.deleteMany({_id: {$in: listing.reviews}});
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;

