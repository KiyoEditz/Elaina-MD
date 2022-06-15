let handler = async (m, { conn, text, usedPrefix }) => {
    const tutor = `Cara melaporkan fitur\n\n1. Reply pesan error\n2. Ketikkan nama\n\nContoh\n${usedPrefix}report Fitur IG error`
    let bug = /bug/i.test(text)
    if (!text) throw tutor
    if (!m.quoted || !m.quoted.text) throw tutor
    if (bug) throw tutor
    conn.fakeReply(global.owner[0] + '@s.whatsapp.net', `*[REPORT]*\nPesan : ${text}`, m.sender, m.quoted.text, m.chat)
    if (!bug) conn.reply(m.chat, '_Bug telah di laporkan ke owner Bot_\n\nArigatouu.. ^_^', m)
}
handler.help = ['report (reply)']
handler.tags = ['main']
handler.command = /^(report|lapor)$/i

handler.fail = null

module.exports = handler