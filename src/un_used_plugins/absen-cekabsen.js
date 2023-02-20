// let handler = async (m, { conn, usedPrefix }) => {
//     let id = m.chat
//     conn.absen = conn.absen ? conn.absen : {}
//     if (!(id in conn.absen)) {
//         await conn.sendButton(m.chat, `Tidak ada absen berlangsung digrup ini!\n\nketik *${usedPrefix}mulaiabsen* untuk memulai absen`.trim(), '', 1, ['Mulai', `${usedPrefix}mulaiabsen`], m)
//         throw false
//     }

//     let d = new Date
//     let date = d.toLocaleDateString('id', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//     })
//     let absen = conn.absen[id][1]
//     let list = absen.map((v, i) => `╟ ${i + 1}. ${db.data.users[v].name}`).join('\n')
//     let caption = `
// Tanggal: ${date}
// ${conn.absen[id][2]}
    
// ╔═〘 Daftar absen 〙
// ║ 
// ╟ Total: ${absen.length}
// ${list}
// ║ 
// ╚════`.trim()
//     await conn.sendButton(m.chat, caption, '', 2, ['Absen', `${usedPrefix}absen`, 'Hapus', `${usedPrefix}hapusabsen`], m)
// }
// handler.help = ['cekabsen']
// handler.tags = ['absen']
// handler.command = /^cekabsen$/i
// handler.group = true
// module.exports = handler