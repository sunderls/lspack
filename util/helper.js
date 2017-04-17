const fs = require('fs');
const path = require('path');

// add .js to modulePath if not there
// support only relative paths now
exports.resolveModulePath = (modulePath, relativeTo = '.') => {
	return path.resolve(relativeTo, /\.\w+$/.test(modulePath) ? modulePath : modulePath + '.js');
}

exports.getModuleContents= (modulePath, rules = {}) => {
	let text = fs.readFileSync(modulePath, {
		encoding: 'utf8'
	});

	// if it is not js, apply loaders
	if (!/\.js/.test(modulePath)) {
		rules.forEach(rule => {
			if (rule.reg.test(modulePath)) {
				text = require(`../loaders/${rule.loader}`)(text);
			}
		});
	}
	return text;
};