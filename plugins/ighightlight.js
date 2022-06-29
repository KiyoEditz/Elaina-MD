let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i.test(args[0]))) throw 'Masukan username tanpa @'
	let res = await fetch(global.API('lolhuman', `/api/highlights/${args[0]}`, 'apikey'))
	if (!res.ok) throw 'Server Error.. Harap lapor owner'
	let json = await res.json()
	if (json.result.length == 0) throw `sorotan tidak ditemukan`
	for (let link of json.result) {
		conn.sendFile(m.chat, link, 'ighl' + (link.includes('mp4') ? '.mp4' : '.jpg'), ``, m)
	}
}
handler.help = ['ighightlight', 'igsorotan'].map(v => v + ' <username>')
handler.tags = ['downloadersosmed']
handler.command = /^(ig(highlights?|sorotan))$/i
handler.limit = true
handler.private = true

module.exports = handler
