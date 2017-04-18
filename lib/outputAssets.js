const fs = require('fs');
module.exports = (assets, output) => {
	assets.forEach(asset => {
		fs.writeFileSync(output(asset.output), asset.source());
	});
}