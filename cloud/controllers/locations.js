/**
 * Created by KHC on 11/14/2015.
 */
var adminFunc = require("cloud/controllers/adminpage")();
module.exports.index = function(req,res){
    adminFunc.getLocation().then(
        function(success){

            res.render('index',{
                title: "Dispatcher Portal",
                locations: JSON.stringify(success)

            });

        },
        function(error){
            console.log("Couldn't get location");
        }
    )

};

module.exports.notify = function(req,res){
    var locName;
    var locID;
    //assuming only 1 item sent
    for(var i in req.body){
        locName = i;
        locID = req.body[i];
    }
    adminFunc.alertUsers(locID,locName);
    res.redirect('/');
};