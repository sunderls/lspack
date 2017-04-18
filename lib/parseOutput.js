// normalize output config
// output filename may contains placeholders

module.exports = ({path = '', fileName}) => {
	switch(typeof fileName) {
		case 'string':
			return (output) => {
				if (output.fileName) {
					return path + output.fileName;
				}
				return path + fileName.replace('[name]', output.name);
			}
			break;
		default:
			throw new Error('output.fileName must be a string');
	}
}