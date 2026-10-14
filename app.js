
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

if(process.env.NODE_ENV!="production"){ // .env will any be used at the time of devlopment
    require('dotenv').config();     //while deploying we should not use or show this.
}

//console.log(process.env.SECRET)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const  passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");


const ExpressError=require("./utils/ExpressError.js");
//const Review=require("./models/review.js");

//routes
const listingRouter=require("./routes/listingsRout.js");
const reviewRouter=require("./routes/reviewsRout.js");
const userRouter=require("./routes/userRout.js");
const router = require("./routes/listingsRout.js");


const dbUrl=process.env.ATLASDB_URL
//DB connection
main().then(()=>{
    console.log("connected to DB");

}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);   
}
 
//for ejs...
app.set("view engine","ejs");
//for views folder
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
//for public folder
app.use(express.static(path.join(__dirname,"/public")));

//session

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("mongostore error",err); 
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7 *24*60*60*1000,
        maxAge:7 *24*60*60*1000,
        httpOnly:true
    }


};



app.use(session(sessionOptions));
app.use(flash());   

//Passport authentication setup.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
//res.locals is used to store data that you want to make 
// available in all the EJS templates for the current request.
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//listing routes
app.use("/listings",listingRouter);

//reviews routes
app.use("/listings/:id/reviews",reviewRouter);

//user routes
app.use("/",userRouter);

//for All
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    let{status=500,message="Somthing went wrong"}=err;
   res.status(400).render("listings/error.ejs",{err});
});
app.listen(8080,()=>{
    console.log("server started...");
});