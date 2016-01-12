require('cloud/app.js');

var constant = {
    USERREQUEST:"UserRequest",
    USERID:"UserId",
    //the DB name isn't very consistent... why?
    LOCATIONID:"LocationID",
    CREATEDAT:"createdAt",
    LOCATION_CLASS:"Location",
    LOCATION_NAME:"name",
    USER_REQUEST_LOCATION_ID:"locationId",
    USER_REQUEST_LOCATION_NAME:"locationName",
    NOTIFICATION_CLASS:"Notified",
    NOTIFIED:"Notified"

};

Parse.Cloud.beforeSave(constant.NOTIFICATION_CLASS, function (request,response) {
    //The request is a notified object
    var location = request.object.get(constant.LOCATIONID);
    var queryObject = {locationId:location};

    var UserRequest = Parse.Object.extend(constant.USERREQUEST);
    var query = new Parse.Query("UserRequest");
    query.equalTo("locationId",location);
    query.notEqualTo("notified",true);
    query.find().then(function(results){
        results.forEach(function(current){
            var query = new Parse.Query(Parse.Installation);
            query.equalTo("user", current.get("userId"));
            query.equalTo('deviceType', 'android');
            Parse.Push.send({
                where: query, // Set our Installation query
                data: {
                    alert: "PubSafe is coming!!"
                }
            }).then(function(result){

            },
                function(error){
                    console.log("hello")
            });
            current.set("notified",true);
            current.save();
        });
        response.error();
    },function(error){
        response.success();
    });
});
