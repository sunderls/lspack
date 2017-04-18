class FileListPlugin {
	apply(lspack) {
		lspack.plugin('assetsGenerated', (assets) => {
			const assetsNow = assets.slice(0);
			assets.push({
				source: () => {
					return assetsNow.map(asset => lspack.output(asset.output)).join('\n');
				},
				output: {
					fileName: 'filelist.md'
				}
			});
		});
	}
}

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		path: './dist/',
		fileName: '[name].js'
	},
	rules: [
		{
			reg: /\.ls$/,
			loader: 'ls'
		}
	],
	plugins: [
		new FileListPlugin()
	]
}