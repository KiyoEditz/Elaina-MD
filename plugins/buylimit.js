const xpperlimit = 350
let confirmbuy = {}

let handler = async (m, { conn, command, args, usedPrefix }) => {
  if (m.sender in confirmbuy) {
    conn.reply(m.chat, 'Konfirmasi dulu penukaran sebelum nya', m)
    throw false
  }
  let count = command.replace(/^buy/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].exp >= xpperlimit * count) {
    confirmbuy[m.sender] = {
      msg: m.reply(`_Kamu akan menukarkan XP sebesar ${xpperlimit * count}_\nDan akan mendapatkan limit sebanyak ${count}\n\nYakin untuk lanjut? (Ya/Y/Yes/Tidak/G/No/N)\n(Waktu 60 detik`),
      xpperlimit,
      count,
      timeout: setTimeout(() => (m.reply('Waktu konfirmasi habis'), delete confirmbuy[m.sender]), 60000)
    }
    throw false

  } else if (global.db.data.users[m.sender].exp <= xpperlimit * count) {
    await conn.reply(m.chat, `_XP kamu tidak mencukupi untuk menukarkan ${count} limit_,\n1 Limit membutuhkan 350 XP\nSilahkan Cek XP kamu.. `, m)
  }
}

handler.all = async function (m) {
  if (!(m.sender in confirmbuy)) return
  let { xpperlimit, count, timeout } = confirmbuy[m.sender]

  if (/^(y(es|a)?)$/i.test(m.text)) {
    global.db.data.users[m.sender].exp -= xpperlimit * count
    global.db.data.users[m.sender].limit += count
    this.reply(m.chat, `_Sukses menukarkan_\n-${xpperlimit * count} XP\n\n+ ${count} Limit\n\nNb: Tidak perlu satu persatu, kamu juga bisa memasukkan jumlah\n\nContoh\n.buy 5`, m)
    clearTimeout(timeout)
    delete confirmbuy[m.sender]
    return !0
  } else if (/^(ga?|tidak|no?)$/i.test(m.text)) {
    delete confirmbuy[m.sender]
    m.reply('Gimana sih -_-')
    clearTimeout(timeout)
    return !0
  }
}
handler.help = ['buy', 'buy [jumlah]', 'buyall']
handler.tags = ['xp']
handler.command = /^buy([0-9]+)|buy|buyall$/i

module.exports = handler

