
//sends backend information in the form of an object notification
// need to constantly query a request to update the MiddRides

module.exports = function(){
    var constant = {
        USERREQUEST:"UserRequest",
        USERID:"UserId",
        //the DB name isn't very consistent... why?
        LOCATIONID:"LocationID",
        CREATEDAT:"createdAt",
        LOCATION_CLASS:"Location",
        LOCATION_NAME:"name",

        NOTIFICATION_CLASS:"Notified"

    };



    var updateLocation = function(locationIDArray,lQueryDate){
        var latestQueryDate = lQueryDate;
        var userRequest =  Parse.Object.extend(constant.USERREQUEST);
        //pull request from everything after a certain period
        var query = new Parse.Query(userRequest);
        //or null or what ever
        if(latestQueryDate !== undefined){
            query.greaterThan(constant.CREATEDAT,latestQueryDate);
        }
        var locationUpdateObject = {
        };
        query.descending(constant.USERREQUEST);
        query.find().then(function(success){
            for(var i =0; i<success.length;i++){

                var date = success[i].get(constant.CREATEDAT);
                var locationID = success[i].get(constant.LOCATIONID);

                if(locationUpdateObject[locationID]===undefined){
                    locationUpdateObject[locationID]=0;
                }else{
                    locationUpdateObject[locationID]+=1;
                }
                if(date>latestQueryDate){
                    latestQueryDate=date;
                }
            }
        },function(fail){

        });
        return locationUpdateObject;
    };

    var getLocation = function(){
        var location= Parse.Object.extend(constant.LOCATION_CLASS);
        var query = new Parse.Query(location);
        var locationsDictionary = {};
        return query.find().then(function(success){

            success.forEach(function(current){
                locationsDictionary[current.id] = current.get(constant.LOCATION_NAME);
                //var userRequest =  Parse.Object.extend(constant.USERREQUEST);
                //var query = new Parse.Query(userRequest);
                //query.notEqualTo(constant.NOTIFIED, true);
                //query.equalTo(constant.USER_REQUEST_LOCATION_ID, current.id);
                //query.find().then(function(succ){
                //    console.log(succ)
                //})
            });
            return locationsDictionary;
        },function(failure){

        });

    };

    var alertUser = function(locID,locName){
        var Notification = Parse.Object.extend(constant.NOTIFICATION_CLASS);
        var notification= new Notification();
        notification.set(constant.LOCATIONID,locID);
        notification.set(constant.LOCATION_NAME,locName);

        notification.save().then(function (success) {
            //shouldn't have this happen
        },function(failure){
            //do nothing
        })

    };


    return {
        updateLocation: updateLocation,
        getLocation: getLocation,
        alertUsers: alertUser,
    }
}


