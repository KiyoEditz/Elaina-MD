let handler = (m, { text, usedPrefix, command }) => {
	let teks = text || (m.quoted && m.quoted.text) || false;
    if (!teks) throw '_Masukkan teks!_\n\nContoh\n' + usedPrefix + command + ' ' + global.author;
	let japan = teks.replace(/[a-z]/gi, v => {
		switch (v.toLowerCase()) {
			case 'a': return 'ka'
			case 'b': return 'zu'
			case 'c': return 'mi'
			case 'd': return 'te'
			case 'e': return 'ku'
			case 'f': return 'lu'
			case 'g': return 'ji'
			case 'h': return 'ri'
			case 'i': return 'ki'
			case 'j': return 'zus'
			case 'k': return 'me'
			case 'l': return 'ta'
			case 'm': return 'rin'
			case 'n': return 'to'
			case 'o': return 'mo'
			case 'p': return 'no'
			case 'q': return 'ke'
			case 'r': return 'shi'
			case 's': return 'ari'
			case 't': return 'chi'
			case 'u': return 'do'
			case 'v': return 'ru'
			case 'w': return 'mei'
			case 'x': return 'na'
			case 'y': return 'fu'
			case 'z': return 'zi'
		}
	})
	m.reply(`Nama jepang:\n\n*${japan[0].toUpperCase() + japan.substring(1)}*`)
}
handler.tags = ['fun']
handler.command = handler.help = ['japan']

module.exports = handler
