let qrcode = require("qrcode")
let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `_Masukkan Teks!_\n\nContoh:\n${usedPrefix}qr Aku sayang kamu`
  conn.sendFile(m.chat, await qrcode.toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', '¯\\_(ツ)_/¯', m)
}
handler.help = ['qrcode <teks>']
handler.tags = ['maker']
handler.command = /^qr(code)?$/i

module.exports = handler

