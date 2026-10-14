const mongoose=require("mongoose");
const Schema=mongoose.Schema;  //not req
const Review=require("./review.js");

//creating schema..
const listSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
    filename: {
        type: String,
       
    },
    url: {
        type: String,
        
    }
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {//mapbox will return the data in this exact same formate(gepjson)
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// Post Middleware for Listing

// Runs automatically after a Listing is deleted.
// Deletes all reviews associated with that listing.
// Prevents orphan reviews from remaining in the Review collection.
// Post Middleware for Listing
// Runs automatically after a Listing is deleted.

listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

//creating model..  model is like a class in java .. we can use
const Lisiting=mongoose.model("Listing",listSchema);
module.exports=Lisiting;