var express = require("express");
var router =  express.Router({mergeParams: true});
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Campground not found");
            console.log(err);
        } 
        else{
            res.render("comments/new", {campground : campground});
        }
    });
});

//Create Comment
router.post("/", middleware.isLoggedIn, function(req, res){
     Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went worng");
            console.log(err);
            res.redirect("/campgrounds");
        } 
        else{
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" +campground._id);
                }
            });
        }
    });
});

//edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
            }
        });
    });   
});

//Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went worng");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment successfully upadated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//Delete Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;