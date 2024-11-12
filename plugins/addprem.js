const fs = require('fs');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let json = JSON.parse(fs.readFileSync('./src/premium.json'));
        let who;
        delete require.cache[require.resolve('../config')];
        require('../config');

        let [num, long] = text.split('|');
        if (!num || isNaN(long)) throw `Masukkan angka mewakili jumlah hari !\n*Misal : ${usedPrefix + command + ' ' + owner[0]} | 30*`;

        if (m.isGroup) who = (m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : num.replace(/[^0-9]/g, '') + '@s.whatsapp.net').trim();
        else who = num ? num.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat;

        let long_time = 86400000 * long.trim();
        if (json.includes(who.split`@`[0])) throw `${conn.getName(who, { withoutContact: true })} sudah premium`;

        json.push(`${who.split`@`[0]}`);
        fs.writeFileSync('./src/premium.json', JSON.stringify(json));

        m.reply(`✅Berhasil menambahkan ${await conn.getName(who, { withoutContact: true })} sebagai member premium selama ${long} Hari`);
        
        conn.sendButton(who, `Hai @${who.split`@`[0]}

Selamat bergabung di _Member Premium_
`.trim(), `Nikmati fitur-fitur yang ada di premium:

${usedPrefix}join <link> => Untuk menambahkan bot ke dalam grup melalui link
${usedPrefix}jadibot => Untuk menjadikan kamu sebagai bot

Selengkapnya klik di Menu Premium`.trim(), 1, [`Menu Premium`, `${usedPrefix}menu premium`], 0, { contextInfo: { mentionedJid: [who] } });

        global.db.data.users[who].premdate = new Date() * 1 + long_time;
        delete require.cache[require.resolve('../config')];
        require('../config');
    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan saat menambahkan premium member: ${e}`);
    }
};

handler.help = ['addprem [@user]'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)prem$/i;
handler.rowner = true;

module.exports = handler;
/*
let fs = require('fs')
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let json = JSON.parse(fs.readFileSync('./src/premium.json'))
    let who
    delete require.cache[require.resolve('../config')]
    require('../config')
    let [num, long] = text.split`|`
    if (!num || isNaN(long)) throw `Masukkan angka mewakili jumlah hari !\n*Misal : ${usedPrefix + command + ' ' + owner[0]} | 30*`
    if (m.isGroup) who = (m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : num.replace(/[^0-9]/g, '') + '@s.whatsapp.net').trim()
    else who = num ? num.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    let long_time = 86400000 * long.trim()
    if (json.includes(who.split`@`[0])) throw `${conn.getName(who, { withoutContact: true })} sudah premium`
    json.push(`${who.split`@`[0]}`)
    fs.writeFileSync('./src/premium.json', JSON.stringify(json))
    m.reply(`✅Berhasil menambahkan ${await conn.getName(who, { withoutContact: true })} sebagai member premium selama ${long} Hari`)
    conn.sendButton(who, `Hai @${who.split`@`[0]}
    
Selamat bergabung di _Member Premium_
`.trim(), `Nikmati fitur" yang ada di premium

${usedPrefix}join <link> => Untuk menambahkan bot ke dalam group melalui link
${usedPrefix}jadibot => untuk manjadikan kamu sebagai bot

Selengkapnya klik di Menu Premium`.trim(), 1, [`Menu Premium`, `${usedPrefix}menu premium`], 0, { contextInfo: { mentionedJid: [who] } })
    global.db.data.users[who].premdate = new Date() * 1 + long_time
    delete require.cache[require.resolve('../config')]
    require('../config')
}
handler.help = ['addprem [@user]']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)prem$/i

handler.rowner = true

module.exports = handler
*/