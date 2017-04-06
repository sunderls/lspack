/*
a 3
b 4

transform above format to json 
{"a":3,"b":4}
*/
module.exports = (text) => {
	return 'export default ' + JSON.stringify(text.split('\n').reduce((a, b) => {
		const segs = b.split(' ');
		a[segs[0]] = segs[1];
		return a;
	}, {}));
}