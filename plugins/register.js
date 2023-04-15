const { createHash } = require('crypto')
let Reg = /(.*)([.|])([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  let user = global.db.data.users[m.sender]
  if (user.registered === true) return conn.reply(m.chat, '_Kamu sudah terdaftar_' + `\n\nketik ${usedPrefix}daftarulang`, m)
  if (!Reg.test(text)) throw `Format salah!\nContoh: *${usedPrefix}daftar Regi|18*`
  let [_, name, splitter, age] = text.match(Reg)
  let totalreg = Object.keys(global.db.data.users).length
  if (!name) throw 'Nama tidak boleh kosong!'
  if (!age) throw 'Umur tidak boleh kosong!'
  if (name.length > 40) throw `Nama terlalu panjang`
  if (parseInt(age) > 40) throw `Mbah mbah tidak boleh main bot`
  if (parseInt(age) < 9) throw `Bocil dilarang main HP!!`
  user.name = name
  user.age = parseInt(age)
  user.regTime = + new Date
  user.registered = true
  await conn.sendFile(m.chat, './src/vn/arigatou.opus', 'suara.opus', null, m, true)
  m.reply(`
Daftar berhasil!
╔═「 Info 」
┣⊱ Nama: ${name}
┣⊱ Umur: ${age}thn
╚══════════
`.trim())
}
handler.help = ['daftar', 'register'].map(v => v + ' <nama|umur>')
handler.tags = ['main']

handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler

