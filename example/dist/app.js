
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
					require(4);
					
				})([function(exports, require){
exports.default = function (text) {
    const p = document.createElement('p');
    p.textContent = text;
    document.body.appendChild(p);
}

return exports; }
,function(exports, require){
var log = require(0)['default'];

exports.log = function(){
    log('ModuleB log()');
}

return exports; }
,function(exports, require){
var logB = require(1)['log'];

var log = require(0)['default'];

exports.default = {
    log() {
        log('ModuleA log()');
        logB();
    }
}

return exports; }
,function(exports, require){
exports.default = {
    'a': '3',
    'b': '4'
}

return exports; }
,function(exports, require){
var A = require(2)['default'];

var data = require(3)['default'];

var log = require(0)['default'];

log('in enty js');
A.log();
log('fetched data in custom loader:');
log(`data.a == ${ data.a }`);

return exports; }
,function(exports, require){
exports.default = function (text) {
    const p = document.createElement('p');
    p.textContent = text;
    document.body.appendChild(p);
}

return exports; }
])
				