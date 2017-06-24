
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('deleteFollowed', function(req, res) {
	//add implementation if we want to cleanup this thing
});
