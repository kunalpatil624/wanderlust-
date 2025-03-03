const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const listing = require("../models/listing.js");


main()

.then((res) => {console.log("succes")})

.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({...obj, owner: "67b5a7f73a8a2016aa25fdaa"}));
  await Listing.insertMany(initdata.data);
  console.log("data inisilized success.");
}

initDB();