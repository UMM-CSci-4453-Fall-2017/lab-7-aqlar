Promise = require('bluebird');
mysql = require('mysql');
var using = Promise.using;
var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

var credentials = require("../credentials.json");
credentials.host="ids"

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection(credentials);
var pool = mysql.createPool(credentials);
var db = 'benek020';
var tableName = db + ".till_buttons";


var getConnection = function(){
	return pool.getConnectionAsync().disposer(
		function(connection){return connection.release();}
	);
};

var query = function(command){
	return using(getConnection(), function(connection){
		return connection.queryAsync(command);
	});
};

var endPool = function(){
	pool.end(function(err){});
};

var getButtons = function(response){
	var buttons = [];
	query(mysql.format("SELECT * FROM ??;",tableName))
	.then(function(results){
		buttons = results.map(jsonifyButton);
		response.send(buttons);
		endPool;
	});
};

var jsonifyButton = function(button){
	var buttonID = button["buttonID"];
	var left = button["left"];
	var topB = button["top"];
	var width = button["width"];
	var label = button["label"];
	var invID = button["invID"];

	var buttonObj = {"buttonID":buttonID,
                         "left":left,
                         "top":topB,
                         "width":width,
                         "label":label,
                         "invID":invID};
         
        return buttonObj;
};

app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
	getButtons(res);
});

app.listen(port);
