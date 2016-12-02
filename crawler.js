var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

request({
	url: "http://www.businessweekly.com.tw/",
	method: "GET"
}, function(error, rquest, response) {
	if (error || !response) {
		return;
	}
	var $ = cheerio.load(response);
	var result = [];
	var hyperlink = $("a");
	for (var i = 0; i < hyperlink.length; i++) {
		console.log($(hyperlink[i]).text() + "  " + $(hyperlink[i]).attr('href'));
		var json = {
			text: $(hyperlink[i]).text(),
			url: $(hyperlink[i]).attr('href')
		};
		result.push(json);
	}
	fs.writeFileSync("crawler_result.json", JSON.stringify(result));
});