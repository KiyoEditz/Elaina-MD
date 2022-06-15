let handler = async (m, { conn }) => {
  conn.reply(m.chat, `
Cantik, manis, imut, baik & tidak sombong
`.trim(), m)
}
handler.customPrefix = /(Vina)/i
handler.command = /^(pass?word(nya)?)$/i

handler.fail = null

module.exports = handler
