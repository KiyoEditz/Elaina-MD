let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
        //global.db.data.users[m.sender].koin = 0
        global.db.data.users[m.sender].limit = 0
        global.db.data.users[m.sender].exp = 0
        global.db.data.users[m.sender].level = 0
        m.reply(`Reset berhasil. Semua *EXP* dan *LIMIT* menjadi Nol`)
}
handler.command = /^(cheatreset)$/i
handler.owner = true
handler.premium = false
module.exports = handler