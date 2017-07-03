
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('deleteFollowed', function(req, res) {
	//add implementation if we want to cleanup this thing
});

Parse.Cloud.define('pushScheduleChanged', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var tournamentId = jsonData.tournamentId;
    // var query = new Parse.Query(Parse.Installation);
    // query.equalTo("installationId", sender);

    Parse.Push.send({
        // where: query,
        // Parse.Push requires a dictionary, not a string.
        channels: [tournamentId],
        data: {"refreshSchedule": true,
               "tournamentId": tournamentId}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});

Parse.Cloud.define('pushEventChanged', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var tournamentName = jsonData.tournamentName;
    var eventId = jsonData.eventId;
    var eventName = jsonData.eventName;
    // Failed attempt
    var userQuery = new Parse.Query("AppUser");
    userQuery.equalTo("followedEvents", eventId);
    var userIds = [];
    userQuery.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                userIds.push(object.get("userId"));
                // alert(object.id + ' - ' + object.get('userId'));
                // console.log(object.id + ' - ' + object.get('userId'));
                console.log('\n' + 'found user: ' + object.get('userId'));
            }
        },
        error: function(error) {
            // alert("Error: " + error.code + " " + error.message);
            console.log('Error: ' + error.code + " " + error.message);
        }
    });
    console.log('user Ids were: ' + userIds);
    var query = new Parse.Query(Parse.Installation);
    query.containedIn("userId", userIds);
    // query.containedIn("userId", ["101577857790860295282", "106250754053988585495"]);

    Parse.Push.send({
        where: query,
        // Parse.Push requires a dictionary, not a string.
        data: {"alert": "Event " + eventName + " in tournament " + tournamentName + " has changed"}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    //This worked with channels
    // Parse.Push.send({
    //     channels: ["Event: " + eventId],
    //     // Parse.Push requires a dictionary, not a string.
    //     data: {"alert": "Event " + eventName + " in tournament " + tournamentName + " has changed"}
    // }, { success: function() {
    //     console.log("#### PUSH OK");
    // }, error: function(error) {
    //     console.log("#### PUSH ERROR" + error.message);
    // }, useMasterKey: true});

    // var query = new Parse.Query(Parse.Installation);
    // query.equalTo("installationId", sender);

    response.success('success');
});

Parse.Cloud.define('testPush', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var sender = jsonData.sender;
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("installationId", sender);

    Parse.Push.send({
        where: query,
        // Parse.Push requires a dictionary, not a string.
        data: {"alert": "This is a push notification test"}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});
