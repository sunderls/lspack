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
	entry: './src/index.js',
	output: './dist/bundle.js',
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