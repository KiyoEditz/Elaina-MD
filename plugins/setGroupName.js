let handler = async (m, { conn, text }) => {
    if (!text) throw `Masukan Nama Baru Untuk Group`
    try {
        await conn.groupUpdateSubject(m.chat, text)
        conn.reply(m.chat, 'Sukses Mengganti Nama Group', m)
    } catch (e) {
        console.log(e)
        throw `Error`
    }
}
handler.help = ['setsubject']
handler.tags = ['owner']
handler.command = /^((set)?(judul|subje(ct|k)))$/i
handler.admin = true
handler.botAdmin = 1

module.exports = handler
