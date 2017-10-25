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

//var buttons=[{"buttonID":1,"left":10,"top":70,"width":100,"label":"hotdogs","invID":1},{"buttonID":2,"left":110,"top":70,"width":100,"label":"hambugers","invID":2},{"buttonID":3,"left":210,"top":70,"width":100,"label":"bannanas","invID":3},{"buttonID":4,"left":10,"top":120,"width":100,"label":"milkduds","invID":4}]; //static buttons
var buttons = [];


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

var getButtons = function(){
	var buttons = [];
	query(mysql.format("SELECT * FROM ??;",tableName))
	.then(function(results){
		for (button in results){
			buttons.push(jsonifyButton(button));
		}
		endPool;
	});
	return Promise.all(buttons);
};

var jsonifyButton = function(button){
	var buttonID = button["buttonID"];
	var left = button["left"];
	var topB = button["top"];
	var width = button["width"];
	var label = button["label"];
	var invID = button["invID"];

	var buttonString = "{buttonID:" + buttonID + ", left:" + left + ", top:" + topB + ", width:" + width + ", label:" + label +", invID:" + invID +"}";

	return buttonString;
	//buttons.push(buttonString); 
};

app.use(express.static(__dirname + '/public')); //Serves the web pages
app.get("/buttons",function(req,res){ // handles the /buttons API
	getButtons()
	.then(function(results){res.send(results)});
});

app.listen(port);
