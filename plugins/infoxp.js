let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, usedPrefix }) => {
    await conn.sendMessage(m.chat, {
        contentText: `
Setiap fitur yang kamu gunakan, 
ada beberapa fitur yang menggunakan *batasan/limit*

*Cara mendapatkan limit*
${conn.readmore}
Kumpulkan XP untuk ditukarkan menjadi limit, melalui salah satu cara yaitu:
1. Klaim XP gratis harian => *Ketik ${usedPrefix}claim*
2. Bermain game yang ada di bot => *Ketik ${usedPrefix}menu game *

Setelah itu, *tukarkan XP* kamu menjadi limit dengan cara *ketik ${usedPrefix}buy*

Kamu bisa melihat jumlah limitmu dengan cara *klik Cek XP* di bawah
`.trim(),
        footerText: `Fitur yang memakai limit ditandai dengan *symbol ($) di samping menu*
Selama Limit kamu cukup, Fitur akan bekerja. Dan sebaliknya, 
Jika limitmu 0, Fitur tidak akan bekerja`.trim(),
        buttons: [
            { buttonId: '.profile', buttonText: { displayText: 'Cek XP' }, type: 1 },
            { buttonId: '.menu game', buttonText: { displayText: 'Main Game' }, type: 1 },
            { buttonId: '.buy', buttonText: { displayText: 'Tukar' }, type: 1 },
        ],
        headerType: 1
    }, MessageType.buttonsMessage, { quoted: m })
}

handler.command = /^infoe?xp$/i
handler.help = ['infoexp']
handler.tags = ['info']

module.exports = handler