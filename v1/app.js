var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Tell our app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// This line keeps us from having to use the .ejs extensino on every file.
app.set("view engine", "ejs");

// Root route/Landing Page
app.get("/", function(req, res) {
    res.render("landing")
});

// Campgrounds page
app.get("/campgrounds", function(req, res) {
    var campgrounds = [
        {name: "Eagle Creek", image:"https://goo.gl/y3VrgW"},
        {name: "Stars Scars Creek", image: "https://cdn.pixabay.com/photo/2017/07/31/22/54/night-2561809_960_720.jpg"},
        {name: "Goat's Foot Campgrounds", image: "https://i.kinja-img.com/gawker-media/image/upload/s--irfxsPD2--/c_scale,f_auto,fl_progressive,q_80,w_800/dibtnkyums3ykyiofqig.jpg"},
        ];
        
        res.render("campgrounds", {campgrounds: campgrounds});
});

// POST route
app.post("/campgrounds", function(req, res) {
    res.send("You hit the post route.")
//   get data from form add to campgrounds array
    // redirect back to campgrounds page
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs")
});

// server listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started")
});