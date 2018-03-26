var express      = require("express"),
    router       =  express.Router(),
    passport     = require("passport"),
    User         = require("../models/user");

var Campground   = require("../models/campground");

router.get("/", function(req, res){
    res.render("landing");
});

/*=========================
  AUTH ROUTES
  =========================*/
  
//Register Form
router.get("/register", function(req,res){
    res.render("register");
});

//SignUp logic
router.post("/register", function(req, res){
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
              req.flash("error", err.message);
              return res.redirect("/register");
            }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login Form
router.get("/login", function(req, res){
    res.render("login");
});

//Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),function(res, res){
});

//LogOut Logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;