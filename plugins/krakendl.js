const krakens = require('../lib/krakendl.js');
const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*🚩 Example:* ${usedPrefix}${command} https://krakenfiles.com/view/neTIvR1wIz/file.html`;
      try {
        const res = await krakens.download(text);
        if (res.error) throw res.error; 
        let msg = `乂 *K R A K E N  D O W N L O A D E R*\n\n`;
        msg += ` ◦ *Name* : ${res.fileName}\n`;
        msg += ` ◦ *View* : unknown\n`;
        msg += ` ◦ *Size* : unknown\n`;
        msg += ` ◦ *Type* : unknown\n`;
        msg += ` ◦ *Uploaded* : unknow\n`;
        msg += ` ◦ *Download* : unknow\n`;
        msg += ` ◦ *Last Download* : unknow\n`;
        msg += ` ◦ *Link* : ${res.downloadLink}\n`;

        await conn.sendFile(m.chat, res.thumbnail, 'thumb_.png', msg, m);
        await conn.sendMessage(m.chat, { document: { url: res.downloadLink }, fileName: res.fileName, mimetype: res.fileName }, { quoted: m });

    } catch (e) { throw e }
};
handler.help = ['krakendl'].map(v => v + '<url>');
handler.tags = ['downloader'];
handler.command =  /^(krakendl|krakendownload)$/i
handler.limit = true;
handler.register = false;
handler.premium = false;

module.exports = handler