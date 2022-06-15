let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i.test(args[0]))) throw 'Masukan username tanpa @'
	let res = await fetch(global.API('xteam', '/dl/ighighlight', {
		nama: args[0]
	}, 'APIKEY'))
	if (!res.ok) throw 'Server Error.. Harap lapor owner'
	let json = await res.json()
	if (json.result.error) throw json.result.message
	let { username, items } = json.result
	for (let { thumbnail, isVideo, url } of items) {
		thumbnail = await (await fetch(thumbnail)).buffer()
		conn.sendFile(m.chat, url, 'ig' + (isVideo ? '.mp4' : '.jpg'), `@${username}`, m, false, {
			thumbnail
		})
	}
}
handler.help = ['ighightlight <username>']
handler.tags = ['downloadersosmed']

handler.command = /^(ighighlight)$/i
handler.limit = true
handler.private = true

module.exports = handler
