const { resolveModulePath } = require('../util/helper');

module.exports = (entry, moduleGraph) => {
	const result = {};
	Object.keys(entry).forEach(key => {
		result[key] = {
			modules: entry[key].map(filename => (
				moduleGraph.map[resolveModulePath(filename)]
				)),
			output: key
		}
	});

	return result;
}