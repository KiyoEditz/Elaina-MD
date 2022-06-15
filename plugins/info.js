let handler = async (m, { conn }) => {
    let { anticall, backup, groupOnly, restrict, autoread } = global.db.data.settings[conn.user.jid]
    const users = Object.values(global.db.data.users)
    const users_registered = users.filter(v => v.registered)
    const chats = conn.chats.all()
    const groups = chats.filter(v => v.jid.endsWith('g.us') && !v.read_only)
    const groups_leave = chats.filter(v => v.jid.endsWith('g.us') && v.read_only)
    let allHits = Object.entries(global.db.data.stats).map(v => v[1].total).reduce((a, b) => a + b)
    let jadibot = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
    let { device_manufacturer, os_version, wa_version, device_model } = conn.user.phone
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    m.reply(`
╔═〘 Info Bot 〙
╟ Aktif selama ${uptime}
╟ Total Hits: *${allHits}*
╟ Total Fitur: *${Object.values(global.plugins).filter(v => !v.all && !v.before).length}*
╟ Total Users: *${users.length}* 
╟ Total Users Terdaftar: *${users_registered.length}* 
╟ Total Users Premium: *${prems.length}* 
╟ Total Users Terbanned: *${Object.entries(global.db.data.users).filter(user => user[1].banned).length}* 
╟ Total Chats Pribadi: *${chats.length - groups.length}*
╟ Total Chats Terbanned: *${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}* 
╟ Total Grups: *${groups.length}*
╟ Total Groups Left: *${groups_leave.length}*
╟ Total Cloning Jadibot: *${jadibot.length}*
╟ Total Nomor Terblock: *${conn.blocklist.length}* 
╚════
╔═〘 Info Device Bot 〙
╟ Nama: *${device_manufacturer} ${device_model}*
╟ OS: *${os_version}*
╟ Baterai: *${conn.battery ? `${conn.battery.value}% ${conn.battery.live ? '🔌 Sedang charging...' : '⚡ Tidak charging'}` : '404'}*
╟ Versi WA: *${wa_version}*
╚════
╔═〘 Settings Bot 〙
╟ Anti Call: ${anticall ? '✅' : '❌'}
╟ Auto Backup: ${backup ? '✅' : '❌'}
╟ GroupOnly: ${groupOnly ? '✅' : '❌'}
╟ Restrict(Add,kick,etc): ${restrict ? '✅' : '❌'}
╟ AutoRead: ${autoread ? '✅' : '❌'}
╚════
    `.trim())
}
handler.help = ['info']
handler.tags = ['info']
handler.command = /^info$/i

module.exports = handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}