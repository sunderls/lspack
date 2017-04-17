// normalize output config
// output filename may contains placeholders

module.exports = ({path = '', fileName}) => {
	switch(typeof fileName) {
		case 'string':

			return (name) => {
				return path + fileName.replace('[name]', name);
			}
			break;
		default:
			throw new Error('output.fileName must be a string');
	}
}