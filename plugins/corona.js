let fetch = require('node-fetch')
let handler = async m => {
  let res = await fetch('https://api.kawalcorona.com/indonesia/')
  let json = await res.json()
  let {
    positif,
    sembuh,
    meninggal,
    dirawat,
  } = json[0]
  m.reply(`
*Total Positif:* ${positif}
*Meninggoy:* ${meninggal}
*Penanganan:* ${dirawat}
*Sembuh:* ${sembuh}
`.trim())
}
handler.help = ['corona']
handler.tags = ['tools']
handler.command = /^(corona)$/i

module.exports = handler