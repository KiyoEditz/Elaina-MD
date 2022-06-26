let handler = async (m, { conn, usedPrefix }) => {
    let users = global.db.data.users[m.sender]
    let chats = global.db.data.chats[m.chat]
    const rows = [
        { title: `Bot Chat Status (${chats.isBanned ? 'Mati' : 'Aktif'})`, description: "Aktifkan atau matikan bot pada chat ini\nOpsi: Chat", rowId: ".bot" },
        { title: `Auto Level Up (${users.autolevelup ? 'Aktif' : 'Mati'})`, description: "Otomatis level up ketika exp mencukupi\nOpsi: Individu", rowId: ".set levelup" },
        { title: `Auto Stiker (${users.stiker ? 'Aktif' : 'Mati'})`, description: "Otomatis menjadikan stiker setiap gambar yang dikirim\nOpsi: Chat", rowId: ".set stiker" },
        { title: `Document (${users.useDocument ? 'Aktif' : 'Mati'})`, description: "File yang dikirim dari fitur download akan dijadikan document\nOpsi: Individu", rowId: ".set document" },
        { title: `Group Game (${chats.game ? 'Aktif' : 'Mati'})`, description: "Ada kalanya mengobrol ada kalanya bermain\nOpsi: Group", rowId: ".set game" },
        { title: `Group Welcome (${chats.welcome ? 'Aktif' : 'Mati'})`, description: "Menyambut member yang baru bergabung di group", rowId: ".set welcome" },
        { title: `Group Antilink (${chats.antilink ? 'Aktif' : 'Mati'})`, description: "Mendeteksi link group", rowId: ".set antilink" },
        { title: `Group Detect (${chats.detect ? 'Aktif' : 'Mati'})`, description: "Mendeteksi setiap ada Admin Group yang baru/dilepas", rowId: ".set detect" },
        { title: `Group Anti PesanSekaliLihat (${chats.viewonce ? 'Mati' : 'Aktif'})`, description: "Meneruskan pesan sekali lihat menjadi pesan biasa", rowId: ".set viewonce" },
        { title: `Group Anti Delete (${chats.delete ? 'Mati' : 'Aktif'})`, description: "Mengembalikan pesan yang di hapus member", rowId: ".set antidelete" },
    ]
    if (!m.isGroup) rows.splice(4, 5)
    const sections = [{ title: "Setting Bot", rows: rows }]

    const button = {
        buttonText: 'Klik disini',
        text: "Silahkan pilih Opsi",
        sections,
    }

    await conn.sendMessage(m.chat, button, { quoted: m })
}

handler.tags = ['info', 'main']
handler.help = ['setting']
handler.command = /^setting$/i

module.exports = handler