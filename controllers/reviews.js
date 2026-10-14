const Listing=require("../models/listing");
const Review=require("../models/review") ;

// post review rout
module.exports.postReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
   // console.log("saved a review");
    req.flash("success","New Review Created");
   res.redirect(`/listings/${listing._id}`);
};
//delete
module.exports.deleteReviews=async(req,res)=>{
    //console.log("delete called");
    let{id,reviewId}=req.params;
// A review is stored in two places:
// 1. In the Review collection
// 2. Its ObjectId is stored inside the Listing's reviews array

// Remove the review's ObjectId from the Listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});  //$pull is used to remove elements form an array
    // Delete the actual review document from the Review collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);

}