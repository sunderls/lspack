module.exports = {
	entry: './src/index.js',
	output: './dist/bundle.js',
	rules: [
		{
			reg: /\.ls$/,
			loader: 'ls'
		}
	]
}