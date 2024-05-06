

let toanime = require('@moonr/to-anime')
let uploadImage = require('../lib/uploadImage.js')

let rodotz = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = await conn.getName(who)
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Send/Reply Images with the caption *' + usedPrefix + 'toanime*'
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  try {
  let media = await q.download()
  let url = await uploadImage(media)
  let res = await toanime(url, api.alya)
  await conn.sendFile(m.chat, res.data.url, '', set.footer, m)
  } catch (error) {
    console.log(error)
    m.reply("Identifikasi gagal!")
  }
}
handler.help = ["toanime","jadianime"]
handler.tags = ["ai"]
handler.command = ["toanime","jadianime"]
module.exports = handler
