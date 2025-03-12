var name = global.nameowner
var numberowner = global.numberowner
var gmail = global.mail
const {
    default:
    makeWASocket,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    downloadContentFromMessage,
    downloadHistory,
    proto,
    getMessage,
    generateWAMessageContent,
    prepareWAMessageMedia
} = require("@whiskeysockets/baileys");
var handler = async (m, {
    conn
}) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN: ${name}
item.ORG: Kiyo•Editz™
item1.TEL;waid=${numberowner}:${numberowner}@s.whatsapp.net
item1.X-ABLabel:Nomor Creator Bot 
item2.EMAIL;type=INTERNET:${gmail}
item2.X-ABLabel:Email Owner
item3.ADR:;;🇮🇩 Indonesia;;;;
item3.X-ABADR:ac
item4.URL:${instagram}
item4.X-ABLabel:Website
item5.EMAIL;type=INTERNET:abiandriansyah3@gmail.com
item5.X-ABLabel:Email Developer 
item6.ADR:;;🇮🇩 Indonesia;;;;
item6.X-ABADR:ac 
item7.URL:https://kiyoeditz.my.id
item7.X-ABLabel:Website
END:VCARD`
    const sentMsg = await conn.sendMessage(
        m.chat,
        {
            contacts: {
                displayName: 'CN',
                contacts: [{ vcard }]
            }
        }
    )
    await conn.reply(m.chat, "Itu Adalah nomor owner Bot", sentMsg)
}
handler.command = handler.help = ['owner', 'creator'];
handler.tags = ['info'];
handler.limit = true;
module.exports = handler;