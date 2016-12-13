var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var crawler = require("./crawler");

var handle = {}
handle["/"] = requestHandlers.init;
handle["/crawl"] = requestHandlers.crawl;

server.init(router.route, handle);


var schedule = require('node-schedule');
var job = schedule.scheduleJob('*/3 * * * *', function() {
	console.log("Schedule trigger crawler");
	crawler.start();
});