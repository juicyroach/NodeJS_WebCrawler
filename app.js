var express = require('express');
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var crawler = require("./crawler");

var app = express();

app.set('port', (process.env.PORT || 5000));

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

		var crawlerResults = [];
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

			crawlerResults.push(jsonResult);
			count++;
		};

		getImage(crawlerResults, render);
	});

	function render(crawlerResults) {
		var oneRowData = [];
		for (var i = 0; i < crawlerResults.length; i++) {
			oneRowData.push(crawlerResults[i]);
			if (i % COLUMN_IN_ROW_COUNT === (COLUMN_IN_ROW_COUNT - 1)) {
				outputCrawlerResult.push(oneRowData);
				oneRowData = [];
			}
		};
		outputCrawlerObject["result"] = outputCrawlerResult;

		res.render('portal', outputCrawlerObject);
	}



	function getImage(crawlerResults, callBackFunction) {
		var count = 0;
		for (var i = 0; i < crawlerResults.length; i++) {
			var crawlerResult = crawlerResults[i];

			getImageUrl(crawlerResult, function() {
				count++;
				if (count == crawlerResults.length) {
					console.log("All image finish");
					callBackFunction(crawlerResults);
				}
			});
		};
	}

	function getImageUrl(crawlerResult, callBackFunction) {
		var url = crawlerResult["url"];
		crawlerResult["imgUrl"] = "#";;
		request({
			url: url,
			method: "GET"
		}, function(error, rquest, response) {
			if (error || !response) {
				callBackFunction();
				return;
			}
			var $ = cheerio.load(response);
			var img = $("img");
			var length = img.length <= 5 ? img.length : 5;
			var randomArray = getRandomArray(0, img.length - 1, length);

			for (var i = 0; i < randomArray.length; i++) {
				var imgUrl = $(img[randomArray[i]]).attr("src");
				if (imgUrl && imgUrl.match("^http")) {
					crawlerResult["imgUrl"] = imgUrl;
					callBackFunction(imgUrl);
					return;
				}

			};

			callBackFunction("");
		});
	}

	function getRandomArray(minNum, maxNum, n) {
		var rdmArray = [n];
		for (var i = 0; i < n; i++) {
			var rdm = 0;
			do {
				var exist = false;
				rdm = getRandom(minNum, maxNum);
				if (rdmArray.indexOf(rdm) != -1) exist = true;
			} while (exist);
			rdmArray[i] = rdm;
		}
		return rdmArray;
	}

	function getRandom(minNum, maxNum) {
		return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



var schedule = require('node-schedule');
var job = schedule.scheduleJob('*/3 * * * *', function() {
	console.log("Schedule trigger crawler");
	crawler.start();
});