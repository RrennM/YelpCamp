var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    User            = require("./models/user"),
    Comment         = require("./models/comment");
    
// start the seeds file - removes all campgrounds.
seedDB();

mongoose.Promise = global.Promise; 

// Connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v6", {useMongoClient: true});

// Tell our app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// This line keeps us from having to use the .ejs extensino on every file.
app.set("view engine", "ejs");

// link css - serve directory
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session") ({
    secret: "Once again chichi is way better than Hank. He sucks.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// function to call current user on every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


// ROOT route/Landing Page
app.get("/", function(req, res) {
    res.render("landing");
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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


// =================================================================
// =========================AUTH====================================
// =================================================================

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("login");
});


// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res) {
});

// handles logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// function to check whether use is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// server listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
});