export default function(text) {
	const p = document.createElement('p');
	p.textContent = text;
	document.body.appendChild(p);
}