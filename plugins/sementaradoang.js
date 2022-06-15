let handler = async (m, { conn, isPrems }) => {
    if (!isPrems) throw `${await conn.getName(m.sender)} Jelek`
    if (new Date - global.db.data.users[m.sender].lastclaim < 86400000) return
    global.db.data.users[m.sender].exp += 1000
    m.reply(`${await conn.getName(m.sender)} Cakep si.. nih +1000 XP`)
}
handler.customPrefix = /^syahrul.ganteng$/i
handler.command = /^$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler