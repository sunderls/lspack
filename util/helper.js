const path = require('path');

// add .js to modulePath if not there
// support only relative paths now
exports.resolveModulePath = (modulePath, relativeTo = '.') => {
	return path.resolve(relativeTo, /\.\w+$/.test(modulePath) ? modulePath : modulePath + '.js');
}