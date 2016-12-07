var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var dataListLimit = 500;
var oneTimeParseLimit = 100;
var overLoadSplitSize = 100;

function getParseData(url, data, fn) {
	cleanList(data);

	request({
		url: url,
		method: "GET"
	}, function(error, rquest, response) {
		if (error || !response) {
			console.log("Error");
			return;
		}
		var $ = cheerio.load(response);
		var list = [];
		var hyperlink = $("a");
		console.log("hyperlink : " + hyperlink.length);
		var count = 0;
		for (var i = 0; i < hyperlink.length; i++) {
			// console.log($(hyperlink[i]).text() + "  " + $(hyperlink[i]).attr('href'));
			if (!canAddToList($(hyperlink[i]), data)) {
				continue;
			}
			var json = {
				text: $(hyperlink[i]).text(),
				url: $(hyperlink[i]).attr('href')
			};
			list.push(json);
			count++;
			if (count >= oneTimeParseLimit) {
				break;
			}
		}

		var result = data.concat(list);

		writeFile(result);
	});

	function cleanList(data) {
		console.log("data size : " + data.length);
		if (data.length > dataListLimit) {
			data.splice(0, overLoadSplitSize);
		}
	}

	function canAddToList(hyperlinkObject, data) {
		var text = hyperlinkObject.text();
		var url = hyperlinkObject.attr('href');

		if (!text) {
			return false;
		}

		if (!url || url.indexOf("http") !== 0) {
			return false;
		}

		for (var i = data.length - 1; i >= 0; i--) {
			var linkObj = data[i];
			if (hyperlinkObject.attr('href') === linkObj["url"]) {
				return false;
			}
		}
		return true;
	}
}



function writeFile(data) {
	fs.writeFileSync("crawler_result.json", JSON.stringify(data));
}

function readFile(fn) {
	fs.readFile('crawler_result.json', 'utf8', function(err, data) {
		if (err) {
			return fn("error");
		}

		var jsonArray = JSON.parse(data)
			// var url = "http://www.businessweekly.com.tw/";
		var url = "https://en.wikipedia.org/wiki/Anna_Kendrick";
		if (jsonArray.length !== 0) {
			var randomNumber = Math.floor((Math.random() * jsonArray.length) + 1);
			url = jsonArray[randomNumber - 1]["url"];
		}

		console.log(url);

		fn(url, JSON.parse(data));
	});
}

function start() {
	readFile(getParseData);
}

start();