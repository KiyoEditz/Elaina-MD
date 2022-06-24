const { indexOf } = require("lodash")

let handler = async (m, { conn }) => {
  let msg
  // if (global.conn.user.jid !== conn.user.jid) {
  let owner = global.db.data.settings[conn.user.jid].owner || conn.user.jid
  let list = [owner, global.owner[2]]
  let listContact = []
  for (let i of list.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')) {
    let name = `${db.data.users[i].name}`
    let contact = {
      "displayName": name,
      "vcard": `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
item1.TEL;waid=${i.split`@`[0]}:${i.split`@`[0]}${(i == global.owner[2] + '@s.whatsapp.net') ? `\nitem1.X-ABLabel:🎹 Piano Musician
item2.EMAIL;type=INTERNET:ini.email@gmail.com
item2.X-ABLabel:✉️ Email
item3.URL:https://www.instagram.com/syhrl_idh
item3.X-ABLabel:Instagram
item4.ADR:;;Puncu, Kediri Regency, East Java, Indonesia;;;;
item4.X-ABADR:id
item4.X-ABLabel:📍 Home Address
BDAY;value=date:2022-06-18
item5.X-ABLabel:🧑‍💼 Bot Owner` : ''}
END: VCARD
`.trim()
    }
    await listContact.push(contact)
  }
  msg = await conn.sendMessage(m.chat, {
    contacts: {
      displayName: (listContact.length > 1 ? `2013 kontak` : listContact[0].displayName) || null,
      contacts: listContact,
    }
  },
    {
      quoted: m,
    })
  //} //  else msg = await conn.sendContact(m.chat, global.owner[2], 'SyahrulArr', m)
  await conn.reply(m.chat, 'Nomor ini bukan bot, tetapi nomor _*pemilik Bot*_\n\nSilahkan chat jika ada keperluan,jangan minta mutualan/saveback kontak karena tidak bakal di back\nChat "P" tidak akan di balas', msg)
}
handler.help = ['owner']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

module.exports = handler
