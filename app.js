var express = require('express');
var fs = require("fs");

var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

const TOTAL_DISPLAY_COUNT = 9;
const COLUMN_IN_ROW_COUNT = 3;

app.get('/', function(req, res) {
	var outputCrawlerObject = {};
	var outputCrawlerResult = [];

	fs.readFile('crawler_result.json', 'utf8', function(err, data) {
		if (err) {
			return fn("error");
		}

		var jsonArray = JSON.parse(data)

		var crawlerResult = [];
		var count = 0;
		while (count < TOTAL_DISPLAY_COUNT) {
			var title = "Empty Title";
			var content = "Empty Content";
			var url = "#";
			if (jsonArray.length !== 0) {
				var randomNumber = Math.floor((Math.random() * jsonArray.length) + 1);
				title = jsonArray[randomNumber - 1]["text"];
				url = jsonArray[randomNumber - 1]["url"];
			}
			if (!title.trim()) {
				continue;
			}

			var jsonResult = {
				title: title.trim(),
				content: content.trim(),
				url: url
			};

			crawlerResult.push(jsonResult);
			count++;
		};

		var oneRowData = [];
		for (var i = 0; i < crawlerResult.length; i++) {
			oneRowData.push(crawlerResult[i]);
			if (i % COLUMN_IN_ROW_COUNT === (COLUMN_IN_ROW_COUNT - 1)) {
				outputCrawlerResult.push(oneRowData);
				oneRowData = [];
			}
		};

		outputCrawlerObject["result"] = outputCrawlerResult;

		res.render('portal', outputCrawlerObject);
	});



});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});