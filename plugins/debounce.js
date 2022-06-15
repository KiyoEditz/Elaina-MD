let { spawn } = require('child_process');
let handler = async (m, { conn }) => {
  if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
  if (global.conn.user.jid == conn.user.jid) {
    await m.reply('_Sedang me-restart Bot_\n\nMohon Tunggu sebentar')
    await global.db.write()
    process.send('reset')
  } else throw '_eeeeeiiittsssss..._'
}
handler.help = ['restart' + (process.send ? '' : ' (Not working)')]
handler.tags = ['host']
handler.command = /^debounce|restart$/i
handler.rowner = true

module.exports = handler