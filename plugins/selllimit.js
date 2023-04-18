const limitperxp = 300
let confirmsell = {}

let handler = async (m, { conn, command, args, usedPrefix }) => {
  if (m.sender in confirmsell) {
    conn.reply(m.chat, 'Konfirmasi dulu penukaran sebelum nya', m)
    throw false
  }
  let count = command.replace(/^sell/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].limit >= count) {
    confirmsell[m.sender] = {
      msg: m.reply(`_Kamu akan menjual limit sebesar ${count}_\nDan akan mendapatkan exp sebanyak ${count * limitperxp}\n\nYakin untuk lanjut? (Ya/Y/Yes/Tidak/G/No/N)\n(Waktu 60 detik)`),
      limitperxp,
      count,
      timeout: setTimeout(() => (m.reply('Waktu konfirmasi habis'), delete confirmsell[m.sender]), 60000)
    }
    throw false

  } else if (global.db.data.users[m.sender].limit <= count) {
    await conn.reply(m.chat, `_Limit kamu tidak mencukupi,\n1 Limit == 300 XP\nSilahkan Cek Limit kamu.. `, m)
  }
}

handler.all = async function (m) {
  if (!(m.sender in confirmsell)) return
  let { limitperxp, count, timeout } = confirmsell[m.sender]

  if (/^(y(es|a)?)$/i.test(m.text)) {
    global.db.data.users[m.sender].exp += limitperxp * count
    global.db.data.users[m.sender].limit -= count
    this.reply(m.chat, `_Sukses menukarkan_\n+${limitperxp * count} XP\n\n-${count} Limit` + `\n\nTidak perlu satu persatu, kamu juga bisa memasukkan jumlah\n\nContoh\n.sell 5`, m)
    clearTimeout(timeout)
    delete confirmsell[m.sender]
    return !0
  } else if (/^(ga?|tidak|no?)$/i.test(m.text)) {
    delete confirmsell[m.sender]
    m.reply('Gimana sih -_-')
    clearTimeout(timeout)
    return !0
  }
}
handler.help = ['sell', 'sell [jumlah]', 'sellall']
handler.tags = ['xp']
handler.command = /^sell([0-9]+)|sell|sellall$/i
handler.disabled = 0
module.exports = handler

