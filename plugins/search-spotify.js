var { searching } = require("../lib/spotify")

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan Judul!\n\nContoh: ${usedPrefix + command} kemarin`
   conn.sendMessage(m.chat, {
      react: {
        text: '🕒',
        key: m.key,
      }
    })
  try { 
  var res = await searching(text)
  var hasil = res.data.map(item => `╭  ∘ Title: *${item.title}*
│  ∘ Popularity: *( ${item.popularity} )*
╰  ∘ Link: 
 ( *${item.url}* )

`).join("\n");
  var name = m.sender
  var fkonn = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: '0@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${await conn.getName(name)}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}};
  await conn.sendMessage(m.chat, {
      text: hasil,
      contextInfo: {
      externalAdReply: {
      title: htjava + ' Spotify Search',
      body: 'Hasil pencarian dari ' + text, 
      thumbnailUrl: 'https://telegra.ph/file/ede5c639173502e7e88cf.jpg',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: fkonn})
} catch (error) {
    console.error(error);
    return m.reply('Terjadi kesalahan\nCode : ' + error);
  }
}

handler.command = handler.help = ['spotifysearch', 'spotifys']
handler.tags = ['search']

module.exports = handler