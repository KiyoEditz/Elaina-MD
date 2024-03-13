let handler = async (m, { conn, args, participants }) => {
    let stats = Object.entries(global.db.data.stats).map(([key, value]) => {
        return { ...value, name: key }
    })
    let all = Object.entries(global.db.data.stats).map(v => v[1].total).reduce((a, b) => a + b)
    let sortedCmd = stats.map(toNumber('total')).sort(sort('total'))
    let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 3)) : Math.min(10, sortedCmd.length)
    let capt = `
╔══「 *Statistik Bot* 」
╟ Total Hits: *${all}*
╟ Total Fitur: *${Object.values(global.plugins).filter(v => !v.all && !v.before).length}*
╟ Total Users: *${Object.keys(db.data.users).length}* 
╚════════════════

╔══「 *${len} Perintah Populer* 」
${sortedCmd.slice(0, len).map(({ name, total }, i) => `╟ ${i + 1}. ${name.split`.js`[0]} ( *${total}* Used )`).join`\n`}
╚════════════════ `.trim()
    conn.reply(m.chat, capt, m)
}
handler.help = ['topcmd']
handler.tags = ['info']
handler.command = /^(topcmd)$/i

module.exports = handler

function sort(property, ascending = true) {
    if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
    else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
    if (property) return (a, i, b) => {
        return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
    }
    else return a => a === undefined ? _default : a
}