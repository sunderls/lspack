#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const escodegen = require('escodegen');

// read lspack.config.js and parse
const config = require(path.resolve('./lspack.config.js'));

// add .js to modulePath if not there
// support only relative paths now
const resolveModulePath = (modulePath, relativeTo = '.') => {
	return path.resolve(relativeTo, /\.\w+$/.test(modulePath) ? modulePath : modulePath + '.js');
}

// get module text contents, with help of loaders
const getModuleContents= (modulePath) => {
	let text = fs.readFileSync(modulePath, {
		encoding: 'utf8'
	});

	// if it is not js, apply loaders
	if (!/\.js/.test(modulePath)) {
		config.rules.forEach(rule => {
			if (rule.reg.test(modulePath)) {
				text = require(`./loaders/${rule.loader}`)(text);
			}
		});
	}
	return text;
};

const modulePaths = [];
const moduleTexts = [];

// get module's ID
// push into modules if not found
const getModuleId = (modulePath) => {
	const id = modulePaths.indexOf(modulePath);
	if (id === -1) {
		return transform(modulePath);
	}

	return id;
}

// transform a file to module
// 1. read file text
// 2. get imports & transform recursively
// 3. return index
const transform = (modulePath) => {
	const transformedResult = [
		'function(exports, require){'
	];

	// read file from entry
	const moduleText = getModuleContents(modulePath);

	// use esprima to detect import statement
	const program = esprima.parse(moduleText, { sourceType: 'module'});

	// handle import & export
	program.body.forEach(line => {
		switch (line.type) {
		case 'ImportDeclaration': 
			const id = getModuleId(resolveModulePath(line.source.value, path.dirname(modulePath)));

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

	moduleTexts.push(transformedResult.join('\n'));
	modulePaths.push(modulePath);
	return moduleTexts.length - 1;
};




const entryModuleId = transform(resolveModulePath(config.entry));

// we've get all modules, now bootstrap
const bundle = `
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
	require(${entryModuleId});
})([${moduleTexts.join(',')}])
`;

// write to dist
fs.writeFileSync(config.output, bundle);
