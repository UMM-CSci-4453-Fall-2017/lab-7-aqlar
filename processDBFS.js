mysql=require('mysql');
dbf=require('./dbf-setup.js');

var getDatabases=function(){ //returns a promise that can take a handler ready to process results
	var sql = "SHOW DATABASES";;
	return dbf.query(mysql.format(sql)); //returns a promise
}

var processDBFs=function(queryResults){
	dbfs=queryResults;
	reurn()dbfs);
}

dbf=getDatabases()
.then(processDBFs)
.then(function(results){console.log(results)})
.then(dbf.releaseDBF);


