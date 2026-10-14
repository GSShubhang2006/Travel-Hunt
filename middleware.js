const Listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError");
const { listingSchema ,reviewSchema } = require("./schema.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You should login first");

        return res.redirect("/login");
    }
    next();
}
// so we can use it after login to redirect the user to the same page
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        // Store the saved URL in locals so it can be easily accessed
        // in the next request/route after login
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//for editing the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

//for deleting the review
module.exports.isAuthor = async (req, res, next) => {
    let {id,reviewId} = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Your not the author..");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

//validation functions
//schema (servre-side validation) function
module.exports.validateListings = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};

// review (servre-side validation) 
module.exports.validateReview= (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.message);
    }

    next();
};