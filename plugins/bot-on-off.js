let handler = async (m, { conn, usedPrefix, isAdmin, isOwner, text }) => {
	if (m.isGroup) {
		if (!(isAdmin || isOwner)) {
			global.dfail('admin', m, conn)
			throw false
		}
		switch (text) {
			case 'off': {
				global.db.data.chats[m.chat].isBanned = true
				m.reply('Bot telah di matikan untuk Group ini')
			}
				break
			case 'on': {
				global.db.data.chats[m.chat].isBanned = false
				m.reply(`Bot telah di nyalakan untuk Group ini\n\nSilahkan ketik ${usedPrefix}menu`)
			}
				break
			default: {
				conn.reply(m.chat, `Opsi ini untuk mengaktifkan/nonaktifkan bot untuk group\n${usedPrefix}bot on/off`, m)
			}
				break
		}
	} else conn.reply(m.chat, `Silahkan ketik ${usedPrefix}menu`, m)
}
handler.help = ['bot [on/off]']
handler.tags = ['group']
handler.command = /^(bot)$/i

module.exports = handler
