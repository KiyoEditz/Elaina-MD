const fetch = require('node-fetch')

let handler = async (m, { text }) => {
  if (!text) throw(`Input Text Dan Karakter!\nExample: .cai hai kamu siapa|Kirito`)    
  try {
    let [ q, k ] = text.split('|')
    m.reply(`Tunggu sebentar...`)
    let js = await fetch(API('btc', 'api/search/c-ai?prompt', { prompt: q, char: k, apikey: btc}))
    let json = await js.json()
    m.reply(json.message)
  } catch (error) {
    console.error(error)
    m.reply('Terjadi kesalahan saat menjalankan perintah.')
  }
}

handler.command = handler.help = ['cai']
handler.tags = ["ai"]
handler.owner = false
handler.limit = false
handler.group = false
handler.private = false

module.exports = handler;