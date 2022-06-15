const kbbi = require('../src/kbbi.json')
function kata() {
	return new Promise(async (resolve, reject) => {
		function random(list) {
			return list[Math.floor(Math.random() * list.length)]
		}
		let huruf = random(['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w'])
		let res = kbbi.filter(v => v.startsWith(huruf))
		resolve({ status: true, kata: random(res) })
	})
}

function cKata(input) {
	return new Promise(async (resolve, reject) => {
		if (!kbbi.find(v => v == input.toLowerCase())) return resolve({ creator: '@neoxrs – Wildan Izzudin', status: false })
		resolve({ creator: '@neoxrs – Wildan Izzudin', status: true })
	})
}

exports.kata = kata
exports.cKata = cKata