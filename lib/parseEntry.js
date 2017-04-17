// extract entries to files array
// entry could be an string, array or an object
// normalize to : { name: [ filePath, ..]}

const { resolveModulePath } = require('../util/helper');

module.exports = (entry) => {
	const result = {};
	switch (typeof entry) {
	case 'string':
		result['default'] = resolveModulePath(entry);
		break;
	case 'object':
		if (Array.isArray(entry)) {
			result['default'] = [];
			entry.forEach(item => {
				if (typeof item !== 'string') {
					throw new Error('unrecognized entry format');
				}
				result['default'].push(resolveModulePath(item));
			});
		} else {
			Object.keys(entry).forEach(key => {
				if (typeof entry[key] !== 'string') {
					throw new Error('unrecognized entry format');
				}
				result[key] = resolveModulePath(entry[key]);
			});
		}
		break;
	default:
		throw new Error('unrecognized entry format')
	}
	return result;
}