// let { WAMessageProto } = require('@whiskeysockets/baileys')
// let handler = async (m, { command, usedPrefix, text: teks }) => {
//     let text = teks.toLowerCase()
//     let M = WAMessageProto.WebMessageInfo
//     let which = command.replace(/add/i, '')
//     if (!m.quoted) throw 'Reply Pesan!'
//     if (!text) throw `Ketik *${usedPrefix}add${which}* nama teks`
//     let msgs = global.db.data.msgs
//     if (text in msgs) throw `'${text}' telah terdaftar di list pesan`
//     msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()
//     m.reply(`Berhasil menambahkan pesan di list pesan sebagai *'${text}'*
    
// Akses dengan ${usedPrefix}get${which} ${text}`)
// }
// handler.help = ['msg'].map(v => 'add' + v + ' <text>')
// handler.tags = ['database']
// handler.command = /^addmsg$/

// module.exports = handler