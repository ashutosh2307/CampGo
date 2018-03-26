var express = require("express");
var router =  express.Router();
var Campground      = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    //Get all campground from database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", "Campground not found");
            console.log(err);
        }
        else {
           res.render("campgrounds/index", {campgrounds : allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn,function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description; 
    var author = {
      id : req.user._id,
      username : req.user.username
    };
    var newCampground = {
        name : name,
        price : price,
        image : image,
        description : description,
        author : author
    };
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Something went worng");
            console.log(err);
        }
        else {
            req.flash("success", "Successfully added campground");
            res.redirect("/campgrounds");
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new.ejs"); 
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        }
        else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

//Edit Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
             req.flash("error", "Campground not found");
             console.log(err);
        }
        else {
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    });
});


//Udate Campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
          req.flash("error", "Campground not found");
          res.redirect("/campgrounds");
       } 
       else {
           req.flash("success", "Campground successfully upadated");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//Destroy Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;