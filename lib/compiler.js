const parseEntry = require('./parseEntry');
const parseOutput = require('./parseOutput');
const collectFiles = require('./collectFiles');
const wrapToModules = require('./wrapToModules');
const generateChunks = require('./generateChunks');
const generateAssets = require('./generateAssets');
const outputAssets = require('./outputAssets');

function Compiler(config) {
	this.entry = parseEntry(config.entry);
	this.output = parseOutput(config.output);
	this.rules = config.rules;
	this.plugins = {};

	config.plugins.forEach(plugin => {
		plugin.apply(this);
	});
}

Compiler.prototype = {
	compile(){
		const files = collectFiles(this.entry);
		this.applyPlugins('filesCollected', files);
		const moduleGraph = wrapToModules(files, this.rules);
		this.applyPlugins('modulesWrapped', moduleGraph);
		const chunks = generateChunks(this.entry, moduleGraph);
		this.applyPlugins('chunksGenerated', chunks);
		const assets = generateAssets(chunks, moduleGraph);
		this.applyPlugins('assetsGenerated', assets);
		outputAssets(assets, this.output);
		this.applyPlugins('assetsOutputted', assets);
	},

	plugin(event, callback) {
		if (!this.plugins[event]) {
			this.plugins[event] = [];
		}

		this.plugins[event].push(callback);
	},

	applyPlugins(event, params) {
		if (this.plugins[event]) {
			this.plugins[event].forEach(plugin => {
				plugin(params);
			});
		}
	}
}

module.exports = Compiler;