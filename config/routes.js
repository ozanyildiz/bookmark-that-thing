


module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', { title: 'Express' });
	});

	app.post('/', function(req, res) {

	});
}