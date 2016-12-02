var request = require("request");
var cheerio = require("cheerio");


request({
	url: "http://www.businessweekly.com.tw/",
	method: "GET"
}, function(error, rquest, response) {
	if (error || !response) {
		return;
	}
	var $ = cheerio.load(response);
	var result = [];
	var titles = $("a");
	for (var i = 0; i < titles.length; i++) {
		console.log($(titles[i]).text() + "  " + $(titles[i]).attr('href'));
	}
});