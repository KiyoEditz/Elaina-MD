

const fetch = require('node-fetch')

let handler = async (m, { text }) => {
  if (!text) return conn.reply(m.chat, '*Example*: .stablediffusion a girl', m)
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  let url = `https://aemt.me/v5/text2img?text=${encodeURIComponent(text)}`
  let image = (await (await fetch(url)).buffer()).toString('base64')
  conn.sendFile(m.chat, `data:image/jpeg;base64,${image}`, 'freefire.jpg', '', m)
}

handler.help = ['stablediffusion <teks>']
handler.tags = ['ai']
handler.command = /^(stablediffusion)$/i
handler.register = true
handler.limit = true

module.exports = handler
