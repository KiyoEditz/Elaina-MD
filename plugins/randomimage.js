let { pinterest } = require('@bochilteam/scraper')

let handler = async (m, { conn, command, usedPrefix }) => {
	command = command.toLowerCase()
	m.reply('_Sedang mencari..._')
	let hasil = conn.pickRandom(await pinterest(command))
	//if (hasil.result.length == 0) throw 'Tidak ada hasil'
	//if (hasil.status !== 200) throw 'Server Error.. Harap lapor owner'
	await conn.sendButtonImg(m.chat, hasil, '_Klik *Next* untuk mencari gambar lain_', '', 2, ['⏩ Next', `${usedPrefix + command}`, '💾 Source', `.reply ${hasil}`.replace('Syahrulidhamz30', '######')], m)

}
handler.help = handler.command = ['bts', 'exo', 'husbu', 'loli']
handler.tags = ['imagerandom']

module.exports = handler