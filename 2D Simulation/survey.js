var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
	cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
};

var app = https.createServer(options);

var	io = require('socket.io').listen(app),
	path = require('path');

app.listen(1023, "0.0.0.0");

var pg = require("pg");

var conString = "pg://postgres:bgoyt6@137.112.92.17:5432/AIxprize";

var client = new pg.Client(conString);
client.connect();

survey_io.on('connection', function(socket) {
console.log("HERESURVEYYYYYY");
	socket.on('send_survey_data_to_server', function(data) {
console.log("HERESURVEY222");
console.log("q1:"+data.q1);
console.log("q2:"+data.q2);
console.log("q3:"+data.q3);
console.log("q4:"+data.q4);
console.log("q5:"+data.q5);
console.log("q6:"+data.q6);

		var query = client.query("INSERT INTO survey(q1, q2, q3, q4, q5, q6) values($1, $2, $3, $4, $5, $6)", [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6]);
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    console.log(JSON.stringify(result.rows, null, "    "));
		    client.end();
		});
		// This will be for data that is received by the survey.
		// It needs its own Node server so as to not conflict with
		// players connecting to the other one.

		// The data that is used will be data.q1, data.q2, data.q3,
		// data.q4, data.q5, and data.q6.
	});
});
