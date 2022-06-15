let fetch = require('node-fetch')
let util = require('util')
let handler = async (m, { text, conn }) => {
  let res = await fetch(text)
  if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, text, 'file', text, m)
  let txt = await res.buffer()
  try {
    txt = util.format(JSON.parse(txt + ''))
  } catch (e) {
    txt = txt + ''
  } finally {
    m.reply(txt.slice(0, 65536) + '')
  }
}
handler.help = ['fetch'].map(v => v + ' <link>')
handler.tags = ['downloader']
handler.command = /^(fetch)$/i

module.exports = handler

