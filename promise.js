Promise=require('bluebird');

var promise= new Promise(function(resolve,reject){
	console.log('Inside resolver function');
	if(true){
  		resolve();
		console.log("it worked");
	} else {
		reject(Eror("it broke"));
	}
});

promise.then(function(){
  console.log('Inside onFulfilled handler');
});

console.log('End of Script');
