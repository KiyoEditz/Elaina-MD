let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [t1, t2] = text.split`|`
  if (!t1) throw `Ketik ${usedPrefix + command} teks`
  let url
  url = await fetch(global.API('lolhuman', `/api/textprome/${command}`, { text: t1 }, 'apikey'))
  if (!url.ok) {
    if (!t2) throw `_Masukkan teks 2_\n\nKetik ${usedPrefix + command} teks | teks2`
    url = await fetch(global.API('lolhuman', `/api/textprome2/${command}`, { text1: t1, text2: t2 }, 'apikey'))
    if (!url.ok) throw `Server Error`
  }
  await conn.sendFile(m.chat, await url.buffer(), 'textpro.jpg', `*TEXTPRO*\n*Effect:* ${command}`, m)

}
handler.tags = ['textpro']
handler.limit = true
handler.command = handler.help = [
  'blackpink', 'neon', 'greenneon',
  'futureneon', 'sandwriting', 'sandsummer',
  'sandengraved', 'metaldark', 'neonlight',
  'holographic', 'text1917', 'minion',
  'deluxesilver', 'newyearcard', 'bloodfrosted',
  'halloween', 'jokerlogo', 'fireworksparkle',
  'natureleaves', 'bokeh', 'toxic',
  'strawberry', 'box3d', 'roadwarning',
  'breakwall', 'icecold', 'luxury',
  'cloud', 'summersand', 'horrorblood',
  'thunder', 'magma', 'impressiveglitch',
  'harrypotter', 'foggywindow', 'watercolor',
  'wonderfulgraffiti', 'pornhub', 'glitch',
  'avenger', 'space', 'ninjalogo',
  'marvelstudio', 'lionlogo', 'wolflogo',
  'steel3d', 'wallgravity', 'coolgravity'
].sort((a, b) => a - b)

module.exports = handler