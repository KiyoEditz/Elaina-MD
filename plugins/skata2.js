global.skata = {};
const { cKata, kata } = require('../lib/sambung-kata.js')
const game = `╔══「 *Kata Bersambung* 」
╟ Game Kata Bersambung adalah
║  permainan yang dimana setiap
║  pemainnya diharuskan membuat
║  kata dari akhir kata yang
║  berasal dari kata sebelumnya.
╚═════`
const rules = `╔══「 *PERATURAN* 」
╟ Jawaban merupakan kata dasar
║  yaitu tidak mengandung
║  spasi dan imbuhan (me-, -an, dll).
╟ Pemain yang bertahan akan
║  menang dan mendapatkan
║  500xp X jumlah pemain
╟ .skata
║  untuk memulai
╚═════`
const poin = 500

let handler = async (m, {
  conn, text, isPrems, isROwner, usedPrefix, command
}) => {
  if (text.toLowerCase().includes('start')) {
    if (!skata[m.chat]) return m.reply(`Harus Bikin skata[m.chat] Dulu Pak`)
    if (Object.keys(skata[m.chat].jids).length < 2) return m.reply(`Kurang Banyak Pemain`)
    skata[m.chat].start = true
    skata[m.chat].now = 0;
    skata[m.chat].length = Object.keys(skata[m.chat].jids).length
    skata[m.chat].exp = Date.now() + require('ms')('20s')
    let rndm = kata_str
    m.reply(`Permainan Di Mulai Dari ${skata[m.chat].jids[Object.keys(skata[m.chat].jids)[0]]}, Susun Kata ${rndm}`)
    return 0;
  }
  let kata_str = (await kata()).data.kata;
  let valid = (await cKata(kata_str)).status
  while (kata_str.length < 3 || kata_str.length > 7 || !valid) {
    kata_str = (await kata()).data.kata;
  }
  if (!skata[m.chat]) {
    skata[m.chat] = {
      jids: {
        [m.sender]: kata_str
      },
      start: false
    }
  } else {
    if (skata[m.chat].jids[m.sender]) m.reply(`Lu Dah Maen`)
    skata[m.chat].jids[m.sender] = kata_str
  }
  m.reply("Kamu Di Masukan Dalam Permainan")
  return 0;
}

handler.before = async (m, {
  conn
}) => {
  if (!skata[m.chat] || !skata[m.chat].start || Object.keys(skata[m.chat].jids).findIndex(tr => tr == m.sender) == skata[m.chat].now) return 0
  let obj = Object.keys(skata[m.chat].jids)
  if (m.chats.toLowerCase().includes(skata[m.chat][obj[now]].toLowerCase())) {
    m.reply(`Anda Dapet Poin, Sekarang Player ${obj[skata[m.chat].now + 1]}`)
  } else {
    m.reply(`Salah, Sekarang Player ${obj[skata[m.chat].now + 1]}`)
  }
  skata[m.chat].now++
}

handler.help = ['sambungkata']
handler.tags = ['game']
handler.command = /^s(ambung)?kata(debug)?2$/i
handler.group = 0
module.exports = handler

function randomize(str) {
  let data = str.split('')
  let total = []
  while (data.length > total.length) {
    let rndm = Math.floor(Math.random() * data.length)
    if (!data[rndm]) continue;
    total.push(data[rndm])
    delete data[rndm]
  }
  return total.join('')
}

async function reply(msg, chat) {
  return conn.sendMessage(msg.key.remoteJid,
    chat,
    'conversation',
    {
      quoted: msg
    })
}

setInterval(() => {
  let data = Object.entries(skata)
  for (let a of data) {
    if (a[1].exp < Date.now()) {
      conn.sendMessage(a[0], `Permainan Di skata[m.chat] Ini Berakhir Blbalbla, a[1] Isi Object Yo Lu Isi Wkwkwk Dengan Pemain\n\n${Object.keys(a[1].jids).join('\n')}`, 'conversation',)
      delete skata[a[0]]
    }
  }
}, 100)