const { URL_REGEX } = require('@whiskeysockets/baileys')
const { fromBuffer } = require('file-type')
const { Pixiv } = require('@ibaraki-douji/pixivts')
const pixiv = new Pixiv()

let handler = async (m, { conn, text }) => {
if (!text) return m.reply('_*masukan link nya!.*_')
await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key },
  });
try {
let res = await pixivDl(text)
for (let i = 0; i < res.media.length; i++) {
let caption = i == 0 ? `╭──── 〔PIXIV〕 ─⬣\n ⬡ *Caption* : ${res.caption}\n ⬡ *Artis* : ${res.artist}\n ⬡ *Tags* : ${res.tags.join(', ')}\n╰────────⬣\n` : ''
let mime = (await fromBuffer(res.media[i])).mime 
let mediaType = mime.split('/')[0]
if (mediaType === 'image') {
if (mediaType === 'image/gif') {
  await conn.sendMessage(m.chat, { video: res.media[i], caption, mimetype: 'video/mp4', gifPlayback: true }, { quoted: m })
} else { 
  await conn.sendMessage(m.chat, { image: res.media[i], caption, mimetype: mime }, { quoted: m })
}
} else if (mediaType === 'video') {
  await conn.sendMessage(m.chat, { video: res.media[i], caption, mimetype: mime }, { quoted: m })
}

await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key },
  });
}
} catch (e) {
    console.log(e);
    m.reply(`An error occurred while donwloading for the pixivid: ${e.message}`);
  }
}
handler.help = ['pixiv *<search>*']
handler.tags = ['downloader', 'img']
handler.command = /^(pixiv|pixivdl)$/i
handler.limit = 1
handler.register = true 
module.exports = handler

async function pixivDl(query) {
	if (query.match(URL_REGEX)) {
		if (!/https:\/\/www.pixiv.net\/en\/artworks\/[0-9]+/i.test(query)) return null
		query = query.replace(/\D/g, '')
		let res = await pixiv.getIllustByID(query).catch(() => null)
		if (!res) return m.reply(`Resultados no encontrados.`)
		let media = []
		for (let x = 0; x < res.urls.length; x++) media.push(await pixiv.download(new URL(res.urls[x].original)))
		return {
			artist: res.user.name, caption: res.title, tags: res.tags.tags.map(v => v.tag), media
		}
	} else {
		let res = await pixiv.getIllustsByTag(query)
		if (!res.length) return m.reply(`Resultados no encontrados.`)
		res = res[~~(Math.random() * res.length)].id
		res = await pixiv.getIllustByID(res)
		let media = []
		for (let x = 0; x < res.urls.length; x++) media.push(await pixiv.download(new URL(res.urls[x].original)))
		return {
			artist: res.user.name, caption: res.title, tags: res.tags.tags.map(v => v.tag), media
		}
	}
}