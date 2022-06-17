let handler = async (m, { conn, text, command, usedPrefix }) => {
    conn.sendButton(m.chat, `*${text.toUpperCase()}*\nAktifkan atau matikan'
    `, 'Pilih aku atau dia :/', 2, ['Aktif', `${usedPrefix}on ${text}`, 'Mati', `${usedPrefix}off ${text}`], m)
}
handler.command = /^set$/i

module.exports = handler