const fetch = require('node-fetch')
const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker')

let handler = async (m, { command, conn, text, usedPrefix, args }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : false
  if (!text) throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix + command} pipupipap`
  let res = await fetch(global.API('xteam', '/ttp', { file: '', teks }))
  let img = await res.buffer()
  if (!img) throw img
  let stiker = await sticker(img, false, global.packname, global.author)
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
}
handler.help = ['ttp5']
handler.tags = ['stickertext']
handler.command = /^ttp5$/i
handler.limit = false

module.exports = handler