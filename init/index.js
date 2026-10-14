const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  data.data=data.data.map((obj)=>({...obj,owner:"6a92a429c6d3f4eacc399815"}))
  await Listing.insertMany(data.data);
  console.log("Data initialized");
};

initDB();