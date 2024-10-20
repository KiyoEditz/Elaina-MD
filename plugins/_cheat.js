let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
        global.db.data.users[m.sender]. money = 999999999
        global.db.data.users[m.sender].limit = 999999999999
        global.db.data.users[m.sender].exp = 99999999999
        global.db.data.users[m.sender].level = 1000
        m.reply(`_*SUKSES CHEAT TELAH AKTIF GUNAKAN DENGAN BIJAK*_`)
}
handler.command = /^(hesoyam)$/i
handler.owner = true
handler.premium = false
module.exports = handler