

let fetch = require('node-fetch')
let handler = async (m, { conn, args, text, command, usedPrefix, isCreator, isPrems }) => {
  if (!text) return m.reply(`*Masukkan Parameter!*\n\nExample: ${usedPrefix + command} a dynamic origami representation of Luffy from One Piece, painted with vibrant colors, capturing the essence of the character's energy, in the style of manga illustrations, exaggerated facial expression, Canon EOS 5D Mark IV, studio portrait, shōnen anime`)
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  m.react('🕒')
  try {
  let alyaKey = global.alya || (global.APIKeys && global.APIKeys['https://api.alyachan.dev/']) || ''
  let url = await fetch(`https://api.alyachan.dev/api/bing-image?q=${text}&apikey=${alyaKey}`)
  const res1 = await url.json()
 let teks1 = `*B I N G - I M G*\n\n`
    teks1 += `  ∘  *Prompt* : ${text}`
  res1.data.map((v, i) => {
            conn.sendFile(m.chat, v.url, '', teks1, m)
        })
  } catch (e) {
    console.log(e)
    return m.reply('```STATUS:```' + e)
  }
}
handler.command = handler.help = ['bing-img','bingimg','bingimage'];
handler.tags = ['ai'];
handler.premium = true;
handler.limit = true;

module.exports = handler
