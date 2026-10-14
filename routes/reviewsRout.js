const express=require("express");
const router=express.Router({ mergeParams: true });
const asyncWrap=require("../utils/asyncWrap.js");
const { listingSchema ,reviewSchema } = require("../schema.js");
//onst ExpressError=require("../utils/ExpressError.js");
//const Listing=require("../models/listing.js");
//const Review=require("../models/review.js");
const {validateReview,isLoggedin,isAuthor}=require("../middleware.js");
const reviewsController=require("../controllers/reviews.js");



//Reviews
// post review rout
router.post("/",validateReview,isLoggedin,asyncWrap(reviewsController.postReview));

// ** delete review rout
router.delete("/:reviewId",isLoggedin,isAuthor,asyncWrap(reviewsController.deleteReviews));

module.exports=router;