let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [t1, t2] = text.split`|`
  if (!t1 && !t2) throw `Ketik ${usedPrefix + command} teks | teks2`
  if (!t2) t2 = 'masukan teks2'
  let url = await fetch(global.API('xteam', `/photooxy/${command}`, { text: t1, text2: t2 }, 'APIKEY'))
  if (!url.ok) throw 'Server Error.. Harap lapor owner'
  await conn.sendFile(m.chat, await url.buffer(), 'photooxy.jpg', `*photooxy*\n*Effect:* ${command}`, m)
}
handler.command = handler.help = [
  "smoke",
  "kopi",
  "wolfmetal",
  "underwaterocean",
  "typography",
  "rainbowshine",
  "graffiti",
  "camuflage",
  "3dglowing",
  "vintage",
  "candy",
  "multimaterial",
  "gradientavatar",
  "glowrainbow",
  "stars",
  "fur",
  "flaming",
  "crispchrome",
  "kueultah",
  "rainbowbg",
  "metalicglow",
  "striking3d",
  "watermelon",
  "harrypotter",
  "8bit",
  "kopi2",
  "luxuryroyal",
  "gerbang",
  "woodblock",
  "smoketypography",
  "sweetcandy",
  "silk",
  "bevel",
  "partyneon",
  "grenleaves",
  "battlefield",
  "pabjigaqi",
  "8bit"
].sort((a, b) => a - b)
handler.tags = ['photooxy']
handler.limit = true

module.exports = handler

