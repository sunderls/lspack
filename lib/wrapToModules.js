const { resolveModulePath, getModuleContents } = require('../util/helper');
const esprima = require('esprima');
const escodegen = require('escodegen');
const path = require('path');

module.exports = function wrap(files, rules, result = [], fileKeyMap = {}){
	switch (typeof files) {
		case 'string':
			const filename = files;
			const transformedResult = [
				'function(exports, require){'
			];

			// read file from entry
			const moduleText = getModuleContents(filename, rules);

			// use esprima to detect import statement
			const program = esprima.parse(moduleText, { sourceType: 'module'});

			const deps = [];

			// handle import & export
			program.body.forEach(line => {
				switch (line.type) {
				case 'ImportDeclaration': 
					const importedModulePath = resolveModulePath(line.source.value, path.dirname(filename));

					if (typeof fileKeyMap[importedModulePath] === 'undefined') {
						wrap(importedModulePath, rules, result, fileKeyMap);
					}
					const id = fileKeyMap[importedModulePath];
					deps.push(result[id]);

					line.specifiers.forEach(specifier => {
						// [TODO] more types
						switch (specifier.type) {
							case 'ImportDefaultSpecifier':
								transformedResult.push(`var ${specifier.local.name} = require(${id})['default'];\n`);
								break;
							case 'ImportSpecifier':
								transformedResult.push(`var ${specifier.local.name} = require(${id})['${specifier.imported.name}'];\n`);
								break;
						}
					});
					break;
				case 'ExportDefaultDeclaration': 
					// export default {}
					if (line.declaration.type === 'ObjectExpression') {
						transformedResult.push(`exports.default = ${escodegen.generate(line.declaration)}`);
						break;
					}

					if (line.declaration.type === 'FunctionDeclaration') {
						transformedResult.push(`exports.default = ${escodegen.generate(line.declaration)}`);
						break;
					}
				case 'ExportNamedDeclaration':
					if (line.declaration.type === 'FunctionDeclaration') {
						transformedResult.push(`exports.${line.declaration.id.name} = function()${escodegen.generate(line.declaration.body)}`);
						break;
					}
				// [TODO] more types
				default:
					transformedResult.push(escodegen.generate(line));
				}
			});
			transformedResult.push('\nreturn exports; }\n');
			result.push({
				source: transformedResult.join('\n'),
				deps
			});
			
			fileKeyMap[filename] = result.length - 1;
			break;
		case 'object':
			if (!Array.isArray(files)) {
				throw new Error('files must by string or string[]')
			}
			files.forEach(file => {
				if (!fileKeyMap[file]) {
					wrap(file, rules, result, fileKeyMap);
				} 
			});
			break;
		default:
			throw new Error('files must by string or string[]')

	}

	return {
		modules: result,
		map: fileKeyMap
	};
}