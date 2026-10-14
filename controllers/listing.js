const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');    //for geocoding
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //sending our token to start the service

//index
module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

//new
module.exports.renderNewForm=(req,res)=>{
    //adding authorization middleware
    
    res.render("listings/new.ejs");
}

//Show
module.exports.showForm=async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });

};

//create
module.exports.create=async(req,res,next)=>{  
    //geocoding 
   let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
 

    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);  
//(can write but lengthy)let{title,description,image,price,location,country}=req.body() ;
    const newlisting=new Listing(req.body.listing); //parsing to create a obj and directly save in DB   
    //for  saving username to display
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings"); 
  
};
//edit
module.exports.editForm=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};
//update
module.exports.updateForm=async (req, res) => {

        let { id } = req.params;

        let listing = await Listing.findById(id);       
        //update
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.location = req.body.listing.location;
        listing.country = req.body.listing.country;

        if (req.body.listing.image && req.body.listing.image.url) {
            listing.image.url = req.body.listing.image.url;
        }

        await listing.save();

        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    };
    //delete
    module.exports.delete=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
};
