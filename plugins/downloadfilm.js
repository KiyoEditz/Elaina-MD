let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix, text }) => {
  try {
    if (!text) throw `masukan judul\nContoh\n${usedPrefix}downloadfilm joker`
    let res = await fetch(global.API('vhtear', '/downloadfilm', {
      judul: text
    }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    let { data, judul } = json.result
    let hasil = json.result.data.map((v) => `Resolusi: ${v.resolusi}\nLink: ${v.urlDownload}`).join('\n===============\n')
    let teks = `*Download Film*

Judul: *${json.result.judul}*\n\n`
    m.reply(teks + hasil)
  } catch (e) {
    throw e //`Gagal, coba lagi nanti`
  }
}
handler.help = ['downloadfilm <judul>']
handler.tags = ['downloader']

handler.command = /^(download)?film$/i
handler.limit = false
handler.disable = true
module.exports = handler