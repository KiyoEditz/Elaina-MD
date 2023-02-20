// let handler = async (m, { conn, usedPrefix }) => {
//     let id = m.chat
//     conn.absen = conn.absen ? conn.absen : {}
//     if (!(id in conn.absen)) {
//         await conn.sendButton(m.chat, `_*Tidak ada absen berlangsung digrup ini!*_\n\nketik *${usedPrefix}mulaiabsen* untuk memulai absen`, '', 1, ['Mulai', `${usedPrefix}mulaiabsen`], m)
//         throw false
//     }

//     let absen = conn.absen[id][1]
//     const wasVote = absen.includes(m.sender)
//     if (wasVote) throw '*Kamu sudah absen!*'
//     absen.push(m.sender)
//     let d = new Date
//     let date = d.toLocaleDateString('id', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//     })
//     let list = absen.map((v, i) => `╟ ${i + 1}. ${db.data.users[v].name}`).join('\n')
//     let caption = `
// Tanggal: ${date}
// ${conn.absen[id][2]}

// ╔═〘daftar absen 〙
// ║
// ╟ Total: ${absen.length}
// ${list}
// ║
// ╚════`.trim()
//     await conn.sendButton(m.chat, caption, '', 2, ['Absen', `${usedPrefix}absen`, 'Cek', `${usedPrefix}cekabsen`], m)
// }
// handler.help = ['absen']
// handler.tags = ['absen']
// handler.command = /^(absen|hadir)$/i
// handler.group = true
// module.exports = handler