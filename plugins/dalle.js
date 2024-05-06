

let fetch = require('node-fetch')
let handler = async (m, { conn, args, text, command, usedPrefix, isCreator, isPrems }) => {
  if (!text) return m.reply(`*Masukkan Parameter!*\n\nExample: ${usedPrefix + command} cat`)
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  try {
  let radit = await fetch(`https://itzpire.site/ai/dalle2?prompt=${text}`)
  const res = await radit.json()
  const start = new Date();
 let teks = `  *D A L L E*\n\n`
    teks += `  ∘  *Prompt* : ${text}`
            conn.sendFile(m.chat, res.result, '', teks, m)
  } catch (e) {
    console.log(e)
    return m.reply('```STATUS:```' + e)
  }
}
handler.command = handler.help = ['dalle'];
handler.tags = ['ai'];
handler.premium = true;
handler.limit = true;

module.exports = handler;
