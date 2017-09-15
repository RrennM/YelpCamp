var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
    
var data = [
        {
            name: "The NEW Eagle Creek :(",
            image: "http://image.oregonlive.com/home/olive-media/width620/img/wildfires/photo/eagle-creek-fire-5d6b885f337fae79jpg-c16aba8c597a5364.jpg",
            description: "Chase red laser dot intently sniff hand, or cats go for world domination. Chase after silly colored fish toys around the house jump off balcony, onto stranger's head yet pose purrfectly to show my beauty for thug cat . Human give me attention meow mice leave dead animals as gifts, behind the couch, yet gnaw the corn cob yet jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls"
        },
        {
            name: "The NEW Eagle Creek, Part 2 :(",
            image: "http://www.kgw.com/img/resize/content.kgw.com/photo/2017/09/05/fire_daniel%20ross_1504628089918_10631386_ver1.0.jpg?preset=534-401",
            description: "Chase red laser dot intently sniff hand, or cats go for world domination. Chase after silly colored fish toys around the house jump off balcony, onto stranger's head yet pose purrfectly to show my beauty for thug cat . Human give me attention meow mice leave dead animals as gifts, behind the couch, yet gnaw the corn cob yet jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls"
        },
        {
            name: "The NEW Eagle Creek, Part 3 :(",
            image: "http://kptv.images.worldnow.com/images/14839660_G.png",
            description: "Chase red laser dot intently sniff hand, or cats go for world domination. Chase after silly colored fish toys around the house jump off balcony, onto stranger's head yet pose purrfectly to show my beauty for thug cat . Human give me attention meow mice leave dead animals as gifts, behind the couch, yet gnaw the corn cob yet jump on human and sleep on her all night long be long in the bed, purr in the morning and then give a bite to every human around for not waking up request food, purr loud scratch the walls"
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