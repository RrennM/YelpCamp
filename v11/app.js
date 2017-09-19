var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    seedDB          = require("./seeds"),
    User            = require("./models/user");
    
// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
// start the seeds file - removes all campgrounds.
// seed the database
// seedDB();

mongoose.Promise = global.Promise; 

// Connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v8", {useMongoClient: true});

// Tell our app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// This line keeps us from having to use the .ejs extensino on every file.
app.set("view engine", "ejs");

// link css - serve directory
app.use(express.static(__dirname + "/public"));

// use method-override and look for "_method" for activiation
app.use(methodOverride("_method"));

// use connect-flash
app.use(flash());


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

// global variables
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// server listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started");
});