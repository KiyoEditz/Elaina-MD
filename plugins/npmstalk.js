let { npmstalk } = require('../lib/npmstalk') 

let handler = async (m, {
    command,
    text,
    conn,
    usedPrefix
}) => {
    if (!text) throw 'Masukkan Username\n\nExample: ' + usedPrefix + command + ' @whiskeysockets/baileys';

    try {
         conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
        let res = await npmstalk(text);
        if (!res) throw res;
        let capt = `*${htjava} N P M - S T A L K*

     • 👤 *Name:* ${res.name}
     • ◀️ *Version Latest:* ${res.versionLatest}
     • ▶️ *Version Update:* ${res.versionUpdate}
     • 🔂 *Version Publish:* ${res.versionPublish}
     • 🛠️ *Latest Dependencies:* ${res.latestdependecies}
     • 🛠️ *Publish Dependencies:* ${res.publishdependecies}
     • 📈 *Publish Time:* ${res.publishTime}
     • 🕒 *Latest Publish:* ${res.latestPublishTime}`

conn.sendFile(m.chat, 'https://telegra.ph/file/b2b2502609f627a794daa.jpg', 'image.jpg', capt, m)
    } catch (e) {
        conn.reply(m.chat, 'Error. Terjadi kesalahan 😔', m);
    }
};

handler.help = ['npmstalk'];
handler.tags = ['tools'];
handler.command = /^(npmstalk)$/i;

module.exports = handler;