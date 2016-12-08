var querystring = require("querystring"),
	fs = require("fs");

function init(response) {
	console.log("Request handler 'init' was called.");

	var body = '<html>' +
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html; ' +
		'charset=UTF-8" />' +
		'</head>' +
		'<body>' +
		'<h1> Hello World </h1> ' +
		'</form>' +
		'</body>' +
		'</html>';

	response.writeHead(200, {
		"Content-Type": "text/html"
	});
	response.write(body);
	response.end();
}

exports.init = init;