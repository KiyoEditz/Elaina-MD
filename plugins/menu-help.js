let obj
let handler = async (m, { conn, usedPrefix: _p, text }) => {
  let teks = '```Hai, perkenalkan!\nAku adalah *Bot (Robot) WhatsApp*\n\nAku diciptakan dan dirancang untuk membalas pesan kamu secara otomatis sesuai fitur yang tersedia pada bot```'
  /*conn.sendButton(m.chat, teks, ``, 1, ['Lanjut', 'lanjut'], m)
  conn.tutor[m.sender] = {}
}*/
handler.all = async function (m) {
  this.tutor = this.tutor ? this.tutor : {}
  if (!m.sender.endsWith('.net')) return
  let reqNama = `Sebelum memulai, Silahkan ketikkan Nama kamu\n\nReply pesan ini`
  if (m.sender in this.tutor) {
    if (/lanjut/i.test(m.text)) {
      this.tutor[m.sender].chat = await m.reply(reqNama)
    }
    if (m.quoted || m.quoted.text || m.quoted.fromMe) {
      if (m.quoted.id == this.tutor[m.sender].chat.id) {
        if (/nama kamu/i.test(m.quoted.text)) {
          db.data.users[m.sender].name = m.text
          this.tutor[m.sender].chat = await m.reply('ketikkan Umur kamu')
        }
        if (/umur kamu/i.test(m.quoted.text)) {
          if (isNaN(m.text)) {
            this.tutor[m.sender].chat = await m.reply('Hanya angka\n\nketikkan Umur kamu')
            return false
          }
          db.data.users[m.sender].age = parseInt(m.text)
          this.tutor[m.sender].chat = await m.reply('Berhasil menyimpan data')
        }
      }
    }
  }
}

handler.command = /^(help)$/i

module.exports = handler;

