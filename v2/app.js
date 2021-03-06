var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.Promise = global.Promise; 

// Connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

// Tell our app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// This line keeps us from having to use the .ejs extensino on every file.
app.set("view engine", "ejs");


// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Stars Scars Creek", 
//         image: "https://cdn.pixabay.com/photo/2017/07/31/22/54/night-2561809_960_720.jpg",
//         description: "Campground wih scarred ground from fallen stars of the past."
        
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     });

// Root route/Landing Page
app.get("/", function(req, res) {
    res.render("landing")
});

// INDEX route - Show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
    res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// Create route - add new campground to db
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
    res.render("new")
});

// SHOW route - shows info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground) {
      if(err) {
          console.log("error");
      } else {
        // render show template with that campground id
        res.render("show", {campground: foundCampground});
      }  
    });
})

// server listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started")
});