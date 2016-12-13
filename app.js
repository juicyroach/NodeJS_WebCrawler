var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));


app.get('/', function(req, res) {
	res.render('portal', {
		title: 'Test EJS',
		users: ['Juicyroach', 'Irene']
	})
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});