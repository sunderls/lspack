// transform chunks to assets with source()
module.exports = (chunks, moduleGraph) => {
	const assets = {};

	Object.keys(chunks).forEach(key => {
		assets[key] = {
			// chunk is made up of entry modules
			source: () => {
				return `
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
					${chunks[key].modules.map(id => (
						`require(${id});`
						))}
					
				})([${moduleGraph.modules.map(module => module.source).join(',')}])
				`;
			},
			output: key
		}
	});

	return assets;
};