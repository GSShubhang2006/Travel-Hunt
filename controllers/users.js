const User=require("../models/user");


//render signup
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};
//signup
module.exports.signup=async (req, res) => {  
    try{
        let { username, email, password } = req.body;  // Get user details from form

        const newUser = new User({ email, username }); // Create new user object

        const registeredUser = await User.register(newUser, password);
        // Hash password + save user in database

        //if signup automatically make login 
        req.login(registeredUser,(err)=>{
        if(err){
            return err;
        }
       req.flash("success", "Welcome to Travel Hunt"); // Set success message
        res.redirect("/listings");
    })
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};

//render login
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs")
};

//login post
module.exports.postLogin=(req, res) => {
        req.flash("success", "Welcome back to Travel Hunt!!");
        res.redirect(res.locals.redirectUrl || "/listings");
};

//logout
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return err;
        }
        req.flash("success","You are logged out ");
        res.redirect("/listings");
    })
};

