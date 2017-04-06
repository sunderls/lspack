
(function(moduleFactories) {
	// all modules should be instantiated lazily
	var modules = [];

	function require(id) {
		if (modules[id]) {
			return modules[id];
		} else {
			var m = moduleFactories[id]({}, require);
			modules.push(m);
			return modules[id];
		}
	}

	// kick 
	require(2);
})([function(exports, require){
exports.log = function(){
    console.log('ModuleB log()');
}

return exports; }
,function(exports, require){
var logB = require(0)['log'];

exports.default = {
    log() {
        console.log('ModuleA log()');
        logB();
    }
}

return exports; }
,function(exports, require){
var A = require(1)['default'];

console.log('in enty js');
A.log();

return exports; }
])
