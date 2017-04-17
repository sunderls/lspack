const esprima = require('esprima');
const path = require('path');
const { resolveModulePath, getModuleContents } = require('../util/helper');

// we check all the entries get all the files
module.exports = function collectFiles(entry, files = new Set()){
	switch (typeof entry) {
		case 'string':
			files.add(resolveModulePath(entry));
			const program = esprima.parse(getModuleContents(entry), { sourceType: 'module'});
			program.body.filter(line => line.type === 'ImportDeclaration')
				.forEach(declaration => {
					files.add(resolveModulePath(declaration.source.value, path.dirname(entry)));
				});
			break;
		case 'object':
			if (Array.isArray(entry)) {
				entry.forEach(item => collectFiles(item, files));
			} else {
				Object.keys(entry).forEach(key => {
					collectFiles(entry[key], files);
				});
			}
			break
		default:
			throw new Error('entry format is not accepted');
	}

	return files;
}