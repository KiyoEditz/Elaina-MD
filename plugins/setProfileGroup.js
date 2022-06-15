let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
        let img = await q.download()
        if (!img) throw 'Gambar tidak ditemukan'
        await conn.updateProfilePicture(m.chat, img).catch(e => { throw 'Gagal' })
        m.reply('Berhasil mengubah foto Group')
    } else throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command}`
}
handler.help = ['setpp', 'setgroupp']
handler.tags = ['admin']

handler.command = /^set(group)?pp$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

module.exports = handler