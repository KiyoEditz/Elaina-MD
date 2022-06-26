const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, text, usedPrefix }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : m.text
  if (teks) {
    let res = await fetch(global.API('xteam', '/attp', { text: teks }))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    conn.sendFile(m.chat, json.result, 'attp.webp', '', m, false, { asSticker: true })
  } else throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix}attp pipupipap`
}
handler.help = ['attp <teks>']
handler.tags = ['stickertext']
handler.command = /^attp2?$/i
handler.limit = true

handler.fail = null

module.exports = handler