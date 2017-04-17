#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const escodegen = require('escodegen');
const parseEntry = require('./lib/parseEntry');
const collectFiles = require('./lib/collectFiles');

// read lspack.config.js and parse
const config = require(path.resolve('./lspack.config.js'));

const entry = parseEntry(config.entry);

const files = collectFiles(entry);
console.log(files);


// const files = collectFiles(config.entry);
// const modules = wrapToModules(files);
// const chunks = generateChunks(config.entry, chunks);
// const assets = generateAssets(chunks);

// outputAssets(assets);

// const modulePaths = [];
// const moduleTexts = [];

// // get module's ID
// // push into modules if not found
// const getModuleId = (modulePath) => {
// 	const id = modulePaths.indexOf(modulePath);
// 	if (id === -1) {
// 		return transform(modulePath);
// 	}

// 	return id;
// }

// // transform a file to module
// // 1. read file text
// // 2. get imports & transform recursively
// // 3. return index
// const transform = (modulePath) => {
// 	const transformedResult = [
// 		'function(exports, require){'
// 	];

// 	// read file from entry
// 	const moduleText = getModuleContents(modulePath);

// 	// use esprima to detect import statement
// 	const program = esprima.parse(moduleText, { sourceType: 'module'});

// 	// handle import & export
// 	program.body.forEach(line => {
// 		switch (line.type) {
// 		case 'ImportDeclaration': 
// 			const id = getModuleId(resolveModulePath(line.source.value, path.dirname(modulePath)));

// 			line.specifiers.forEach(specifier => {
// 				// [TODO] more types
// 				switch (specifier.type) {
// 					case 'ImportDefaultSpecifier':
// 						transformedResult.push(`var ${specifier.local.name} = require(${id})['default'];\n`);
// 						break;
// 					case 'ImportSpecifier':
// 						transformedResult.push(`var ${specifier.local.name} = require(${id})['${specifier.imported.name}'];\n`);
// 						break;
// 				}
// 			});
// 			break;
// 		case 'ExportDefaultDeclaration': 
// 			// export default {}
// 			if (line.declaration.type === 'ObjectExpression') {
// 				transformedResult.push(`exports.default = ${escodegen.generate(line.declaration)}`);
// 				break;
// 			}

// 			if (line.declaration.type === 'FunctionDeclaration') {
// 				transformedResult.push(`exports.default = ${escodegen.generate(line.declaration)}`);
// 				break;
// 			}
// 		case 'ExportNamedDeclaration':
// 			if (line.declaration.type === 'FunctionDeclaration') {
// 				transformedResult.push(`exports.${line.declaration.id.name} = function()${escodegen.generate(line.declaration.body)}`);
// 				break;
// 			}
// 		// [TODO] more types
// 		default:
// 			transformedResult.push(escodegen.generate(line));
// 		}
// 	});
// 	transformedResult.push('\nreturn exports; }\n');

// 	moduleTexts.push(transformedResult.join('\n'));
// 	modulePaths.push(modulePath);
// 	return moduleTexts.length - 1;
// };




// const entryModuleId = transform(resolveModulePath(config.entry));

// // we've get all modules, now bootstrap
// const bundle = `
// (function(moduleFactories) {
// 	// all modules should be instantiated lazily
// 	var modules = [];

// 	function require(id) {
// 		if (modules[id]) {
// 			return modules[id];
// 		} else {
// 			var m = moduleFactories[id]({}, require);
// 			modules.push(m);
// 			return modules[id];
// 		}
// 	}

// 	// kick 
// 	require(${entryModuleId});
// })([${moduleTexts.join(',')}])
// `;

// // write to dist
// fs.writeFileSync(config.output, bundle);
