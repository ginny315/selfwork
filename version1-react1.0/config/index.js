var path = require('path');
module.exports = function(app) {
	app.set('port', (process.env.PORT || 4000));
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.listen(app.get('port'), function() {
	  console.log('Express started in:'+app.get('env')+' Server started: http://localhost:' + app.get('port') + '/');
	});
	return app;
}