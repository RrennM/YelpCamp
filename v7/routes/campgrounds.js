var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// INDEX route - Show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE route - add new campground to db
router.post("/", function(req, res) {
    // get data from form add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW route - show form to create new campground
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW route - shows info about one campground
router.get("/:id", function(req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if(err) {
          console.log("error");
      } else {
          console.log(foundCampground);
        // render show template with that campground id
        res.render("campgrounds/show", {campground: foundCampground});
      }  
    });
});


module.exports = router;