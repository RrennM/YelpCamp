var express         = require("express");
var router          = express.Router({mergeParams: true});
var methodOverride  = require("method-override");
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var middleware      = require("../middleware");

// NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE Route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
            // create new comments
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comments to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    // redirect to show page    
                    req.flash("success", "You have successfully created comment.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "You have successfully updated the comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "You have successfully deleted the comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;