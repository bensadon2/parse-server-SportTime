
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('deleteFollowed', function(req, res) {
	//add implementation if we want to cleanup this thing
});

Parse.Cloud.define('pingReply', function(request, response) {
    var params = request.params;
    var customData = params.customData;

    if (!customData) {
        response.error("Missing customData!")
    }

    var jsonData = JSON.parse(customData);
    var sender = jsonData.sender;
    var tourName = jsonData.tournamentName;
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("installationId", sender);

    Parse.Push.send({
        where: query,
        // Parse.Push requires a dictionary, not a string.
        data: {"alert": "You created a tournament named: " + tourName}
    }, { success: function() {
        console.log("#### PUSH OK");
    }, error: function(error) {
        console.log("#### PUSH ERROR" + error.message);
    }, useMasterKey: true});

    response.success('success');
});
