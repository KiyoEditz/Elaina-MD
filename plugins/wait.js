// https://github.com/Nobuyaki
// Jangan Hapus link githubnya bang :)

const fetch = require('node-fetch')
const FormData = require('form-data')

let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `Reply Foto/Kirim Foto Dengan Caption ${usedPrefix}wait`
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  await m.reply('_Sedang mencari judul Anime..._')
  let image = `data:image/jpeg;base64,${img.toString('base64')}`
  let response = await fetch("https://trace.moe/api/search", {
    method: "POST",
    body: JSON.stringify({ image }),
    headers: { "Content-Type": "application/json" }
  })
  if (!response.ok) throw 'Gambar tidak ditemukan!'
  let result = await response.json()
  let { is_adult, title, title_chinese, title_romaji, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
  let link = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
  let nobuyaki = `
${similarity < 0.89 ? 'Aku Memiliki Keyakinan Rendah Tentang Hal Ini nee-san' : ''}

● Judul Jepang : *${title}*
● Ejaan Judul : *${title_romaji}*
● Kemiripan : *${(similarity * 100).toFixed(1)}%*
● Episode : *${episode.toString()}*
● Ecchi : *${is_adult ? 'Yes' : 'No'}*
`.trim()
  conn.sendFile(m.chat, link, 'srcanime.mp4', `${nobuyaki}`, m)
}
handler.help = ['wait (caption|reply image)']
handler.tags = ['tools', 'image']
handler.command = /^(wait)$/i

module.exports = handler