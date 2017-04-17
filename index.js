#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const parseEntry = require('./lib/parseEntry');
const collectFiles = require('./lib/collectFiles');
const wrapToModules = require('./lib/wrapToModules');

// read lspack.config.js and parse
const config = require(path.resolve('./lspack.config.js'));

const entry = parseEntry(config.entry);

const files = collectFiles(entry);
const wrappedModules = wrapToModules(files, config.rules);
console.log(wrappedModules);
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
