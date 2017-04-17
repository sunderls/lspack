class FileListPlugin {
	apply(lspack) {
		lspack.plugin('assetsConfirmed', ({assets}) => {
			assets['filelist.md'] = {
				source: () => {
					assets.map(asset => asset.filename).join('\n');
				}
			};
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