let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [t1, t2] = text.split`|`
  if (!t1) throw `Ketik ${usedPrefix + command} teks`
  let url
  url = await fetch(global.API('lolhuman', `/api/textprome/${command}`, { text: t1 }, 'apikey')).catch(e => {
    if (!t1 && !t2) throw `_Masukkan teks 2_\n\nKetik ${usedPrefix + command} teks | teks2`
    url = await fetch(global.API('lolhuman', `/api/textprome/${command}`, { text1: t1, text2: t2 }, 'apikey'))
  })
  if (!url.ok) throw 'Server Error.. Harap lapor owner'
  await conn.sendFile(m.chat, await url.buffer(), 'textpro.jpg', `*TEXTPRO*\n*Effect:* ${command}`, m)
}
handler.tags = ['textpro']
handler.limit = true
handler.command = handler.help = ["Shadow", "Cup", "Cup2", "Romance", "Smoke", "BurnPaper", "LoveMessage", "UnderGrass", "Love", "Coffe", "WoodHeart", "WoodenBoard", "Summer3D", "WolfMetal", "Nature3D", "UnderWater", "GoldenRose", "SummerNature", "FallLeaves", "Flamming", "HarryPotter", "CarvedWood", "Tiktok", "Arcade8bit", "Battlefield4", "PUBG", "BannerLOL"].sort((a, b) => a - b)

module.exports = handler

