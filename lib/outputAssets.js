const fs = require('fs');
module.exports = (assets, output) => {
	Object.keys(assets).forEach(key => {
		fs.writeFileSync(output(key), assets[key].source());
	});
}