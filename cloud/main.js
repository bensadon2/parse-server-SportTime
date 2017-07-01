
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
        channels: [tournamentId.toString()],
        data: {"refreshSchedule": true,
               "tournamentId": tournamentId}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});
