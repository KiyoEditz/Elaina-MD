// let handler = async (m, { usedPrefix, command }) => {
//     let which = command.replace(/list/i, '')
//     let msgs = global.db.data.msgs
//     let split = Object.entries(msgs).map(([nama, isi]) => { return { nama, ...isi } })
//     let fltr = split
//     if (!fltr) throw 'Tidak ada'
//     if (/all/i.test(command)) fltr = split
//     if (/audio/i.test(command)) fltr = split
//         .filter(v => v.message.audioMessage)
//         .filter(m => m.message.audioMessage.ptt == false).catch(e => m.reply('Tidak ada'))
//     if (/doc/i.test) fltr = split.filter(v => v.message.documentMessage).catch(e => m.reply('Tidak ada'))
//     if (/vn/i.test(command)) fltr = split
//         .filter(v => v.message.audioMessage)
//         .filter(m => m.message.audioMessage.ptt == true).catch(e => m.reply('Tidak ada'))
//     if (/video/i.test(command)) fltr = split
//         .filter(v => v.message.videoMessage && !v.message.videoMessage.gifPlayback).catch(e => m.reply('Tidak ada'))
//     if (/gif/i.test(command)) fltr = split
//         .filter(v => v.message.videoMessage)
//         .filter(m => m.message.videoMessage.gifPlayback).catch(e => m.reply('Tidak ada'))
//     if (/stic?ker/i.test(command)) fltr = split.filter(v => v.message.stickerMessage).catch(e => m.reply('Tidak ada'))
//     if (/msg/i.test(command)) fltr = split.filter(v => v.message.conversation).catch(e => m.reply('Tidak ada'))
//     if (/img/i.test(command)) fltr = split.filter(v => v.message.imageMessage).catch(e => m.reply('Tidak ada'))
//     let list = fltr.map(v => `├ ${v.nama} ${v.locked ? '(🔒)' : ''}`).join('\n')
//     if (list === '') throw 'Tidak ada'
//     m.reply(`
// *LIST PESAN*

// ${list}

// Akses/ambil dengan nengetik:
// *${usedPrefix}get${which}* <nama>
// `.trim())
// }
// handler.help = ['vn', 'msg', 'video', 'gif', 'audio', 'img', 'sticker', 'doc'].map(v => 'list' + v)
// handler.tags = ['database']
// handler.command = /^list(vn|msg|video|audio|img|stic?ker|gif|doc)$/

// module.exports = handler