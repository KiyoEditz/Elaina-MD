let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [t1, t2] = text.split`|`
  if (!t1) throw `Ketik ${usedPrefix + command} teks`
  let url
  url = await fetch(global.API('lolhuman', `/api/photooxy1/${command}`, { text: t1 }, 'apikey'))
  if (!url.ok) {
    if (!t2) throw `_Masukkan teks 2_\n\nKetik ${usedPrefix + command} teks | teks2`
    url = fetch(global.API('lolhuman', `/api/photooxy2/${command}`, { text1: t1, text2: t2 }, 'apikey'))
    if (!url.ok) throw `Server Error`
  }
  await conn.sendFile(m.chat, await url.buffer(), 'photooxy.jpg', `${command}`, m)
}
handler.command = handler.help = [
  'shadow', 'cup',
  'cup2', 'romance',
  'smoke', 'burnpaper',
  'lovemessage', 'undergrass',
  'love', 'coffe',
  'woodheart', 'woodenboard',
  'summer3d', 'wolfmetal',
  'nature3d', 'underwater',
  'goldenrose', 'summernature',
  'fallleaves', 'flamming',
  'harrypotter', 'carvedwood',
  , 'arcade8bit',
  'battlefield4', 'pubg',
  'bannerlol'
].sort((a, b) => a - b)
handler.tags = ['photooxy']
handler.limit = true

module.exports = handler