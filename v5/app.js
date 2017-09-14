var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment");
    
// start the seeds file - removes all campgrounds.
seedDB();

mongoose.Promise = global.Promise; 

// Connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v4", {useMongoClient: true});

// Tell our app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// This line keeps us from having to use the .ejs extensino on every file.
app.set("view engine", "ejs");

// link css - serve directory
app.use(express.static(__dirname + "/public"));


// ROOT route/Landing Page
app.get("/", function(req, res) {
    res.render("landing")
});


// =================================================================
// ======================CAMPGROUNDS================================
// =================================================================

// INDEX route - Show all campgrounds
app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
});

// SHOW route - shows info about one campground
app.get("/campgrounds/:id", function(req, res) {
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


// =================================================================
// =======================COMMENTS==================================
// =================================================================

// NEW route
app.get("/campgrounds/:id/comments/new", function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
            // create new comments
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // connect new comments to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to show page    
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    });
});

// server listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
});