let handler = async (m, { conn }) => {
  m.reply(`
Cantik, manis, imut, baik & tidak sombong
`.trim())
}
handler.customPrefix = /^rahma$/i
handler.command = /^pas/i

handler.fail = null

module.exports = handler
