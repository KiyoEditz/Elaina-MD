let handler = async (m, { conn, text, usedPrefix, command }) => {
    const deleteMessage = { delete: { remoteJid: m.key.remoteJid, fromMe: false, id: m.key.id, participant: [m.sender] } };
    await conn.sendMessage(m.chat, deleteMessage);
    conn.sendMessage(m.chat, {text: '*Minimal salam deckk*😹'},{quoted: m, ephemeralExpiration: global.ephemeral})
    }
    
    handler.customPrefix = /^(p)$/i
    handler.command = new RegExp
    handler.fail = null 
    module.exports = handler