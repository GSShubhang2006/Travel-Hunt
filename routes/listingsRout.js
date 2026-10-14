const express=require("express");
const router=express.Router();

const asyncWrap=require("../utils/asyncWrap.js");
const { reviewSchema } = require("../schema.js");
//const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedin,isOwner,validateListings}=require("../middleware.js")
const lisitngController=require("../controllers/listing.js");

//for image upload
const multer  = require('multer');
let{storage}=require("../cloudConfig.js");
const upload = multer({storage});


//router.route(path): Used to group multiple HTTP methods for the same route/path,
//  making the code cleaner and avoiding repetition.
router.route("/")
      .get(asyncWrap(lisitngController.index))  //index rout
        // create rout (imp method)
        //("rout"," type of middileware",callback)  
      //.post(validateListings,isLoggedin,asyncWrap(lisitngController.create));
    .post(
    upload.single("listing[image][url]"),
    validateListings,
    isLoggedin,
    asyncWrap(lisitngController.create)
);
//new rout
router.get("/new",isLoggedin,lisitngController.renderNewForm);

router.route("/:id")
      .get( asyncWrap(lisitngController.showForm))  // show route
      .put(
        validateListings,                                 //update rout
        isLoggedin,                         
        isOwner,
        asyncWrap(lisitngController.updateForm)
    )
    .delete(isLoggedin,isOwner,asyncWrap(lisitngController.delete));  //delete rout          


//edit rout
router.get("/:id/edit",isLoggedin,asyncWrap(lisitngController.editForm));

module.exports=router;