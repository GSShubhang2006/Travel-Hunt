const express=require("express");
const router=express.Router({ mergeParams: true });
const User=require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const  passport=require("passport");
const{saveRedirectUrl}=require("../middleware")

const userController=require("../controllers/users");


//router.route(path): Used to group multiple HTTP methods for the same route/path,
//  making the code cleaner and avoiding repetition.

router.route("/signup") //SIGNUP ROUT
      .get(userController.renderSignup)  
      .post(asyncWrap(userController.signup));
 

router.route("/login")  
      .get(userController.renderLogin)
      .post(
            
            saveRedirectUrl,
            passport.authenticate("local", {   
        // actual login is done by passport in controller we written logic for after successfull login
                failureRedirect: "/login",
                failureFlash: true
            }),
            userController.postLogin
        );
//LOGOUT
router.get("/logout",userController.logout);

module.exports=router; 