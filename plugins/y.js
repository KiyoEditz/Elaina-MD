let handler = async (m, { conn }) => {
  conn.reply(m.chat, `
Y`.trim(), m)
}
handler.customPrefix = /^(Y)$/i
    handler.command = new RegExp
    handler.fail = null 
    module.exports = handler