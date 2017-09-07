var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
    
var data = [
        {
            name: "The NEW Eagle Creek :(",
            image: "http://image.oregonlive.com/home/olive-media/width620/img/wildfires/photo/eagle-creek-fire-5d6b885f337fae79jpg-c16aba8c597a5364.jpg",
            description: "Eagle Creek will never be the same."
        },
        {
            name: "The NEW Eagle Creek, Part 2 :(",
            image: "http://www.kgw.com/img/resize/content.kgw.com/photo/2017/09/05/fire_daniel%20ross_1504628089918_10631386_ver1.0.jpg?preset=534-401",
            description: "Eagle Creek will never be the same."
        },
        {
            name: "The NEW Eagle Creek, Part 3 :(",
            image: "http://kptv.images.worldnow.com/images/14839660_G.png",
            description: "Eagle Creek will never be the same."
        },
    ];
    
function seedDB() {
    // remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.lof(err);
        }
        
        console.log("Removed campgrounds!");
        
        // add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
               if(err){
                   console.log(err);
               } else {
                //   create a comment
                    Comment.create(
                        {
                          text: "This place was great! But I think it would be nicer without all the fire..",
                          author: "Homer"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment.")
                            }
                        }
                    );
               }
            });
        });
    });
    

    
    // add a few comment
}

module.exports = seedDB;