var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");


function getParseData(url, data, fn) {
	request({
		url: "http://www.businessweekly.com.tw/",
		method: "GET"
	}, function(error, rquest, response) {
		if (error || !response) {
			return;
		}
		var $ = cheerio.load(response);
		var list = [];
		var hyperlink = $("a");
		var parseSize = hyperlink.length >= 30 ? 30 : hyperlink.length;
		for (var i = 0; i < parseSize; i++) {
			console.log($(hyperlink[i]).text() + "  " + $(hyperlink[i]).attr('href'));
			var text = $(hyperlink[i]).text();
			var url = $(hyperlink[i]).attr('href');
			if (!url || url.indexOf("http") !== 0 || text.indexOf(" ") === 0) {
				continue;
			}
			var json = {
				text: text,
				url: url
			};
			list.push(json);
		}

		var result = data.concat(list);

		writeFile(result);
	});
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
		var url = "http://www.businessweekly.com.tw/";
		if (jsonArray.length !== 0) {
			var randomNumber = Math.floor((Math.random() * jsonArray.length) + 1);
			url = jsonArray[randomNumber - 1]["url"];
		}

		console.log(url);

		fn("url", JSON.parse(data));
	});
}

function start() {
	readFile(getParseData);
}

start();