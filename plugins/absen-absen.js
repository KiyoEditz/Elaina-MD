let handler = async (m, { conn }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    if (!(id in conn.absen)) {
        await conn.reply(m.chat, `tidak ada absen berlangsung!\n.mulaiabsen`, m)
        throw 0
    }

    let absen = conn.absen[id][1]
    const wasVote = absen.includes(m.sender)
    if (wasVote) throw 'udah absen!'
    absen.push(m.sender)
    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let list = absen.map((v, i) => `├ ${i + 1}. ${db.data.users[v].name.startsWith('+') ? m.sender.split('@')[0] : db.data.users[v].name}`).join('\n')
    let caption = `
${date}
${conn.absen[id][2]}

┌「 absen 」
├ total: ${absen.length}
${list}
└────`.trim()
    await conn.reply(m.chat, caption, m, { mentions: [m.sender] })
}
handler.help = ['absen']
handler.tags = ['absen']
handler.command = /^(absen|hadir|presence)$/i

module.exports = handler