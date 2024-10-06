let handler = async (m, { conn }) => {
	if (m.fromMe) return false
  conn.reply(m.chat, `
Ketoprak 🤤
`.trim(), m)
}
handler.customPrefix = /ketoprak/i
handler.command = new RegExp

module.exports = handler