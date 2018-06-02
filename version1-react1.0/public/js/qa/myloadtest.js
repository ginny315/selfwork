var loadtest = require('loadtest');
var chai = require('chai');
var expect = chai.expect;

suite('Stress tests',function(){
	test('Homepage should handle 100 request in a second',function(done){
		var options = {
			url:'http://localhost:3000',
			concurrency:4,
			maxRequest:100
		};
		loadtest.loadTest(options,function(err,result){
			expect(!err);
			expect(result.totalTimeSeconds < 1);
			done();
		});
	});
});

//not grunt bash input:mocha --ui tdd public/js/qa/myloadtest.js