/*

- *[ BUTTON IMAGE ]*
- By: Fauzialifatah X Fahmi
- https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z

*/

let handler = async(m, { conn, command, text, args }) => {
const owned = owner + "@s.whatsapp.net"
let awal = `Selamat datang kak *${conn.user.name}*`
conn.sendMessage(m.chat, {
 image: { url: 'https://files.catbox.moe/iejoer.jpg'},
 caption: awal,
footer: `─ Waktu: *${botdate}*\n─ Runtime: *${bottime}*`,
 contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 999,
isForwarded: true,
externalAdReply: {
  showAdAttribution: true, 
  title: `PokPok`,
  body: "Thezy - Chan",
  thumbnailUrl: 'https://cdn.arifzyn.site/f/sy6tjbzk.jpg',
  sourceUrl: "https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z",
  mediaType: 1,
  renderLargerThumbnail: false
}}, 
  buttons: [
  {
 buttonId: '.tes',
 buttonText: {
displayText: 'Owner Botz'
 },
 type: 1,
  },
  {
 buttonId: '.thxto',
 buttonText: {
displayText: 'Supporter'
 },
 type: 1,
  },
  {
 type: 4,
 nativeFlowInfo: {
name: 'single_select',
paramsJson: JSON.stringify({
  title: 'Klick Hare!!',
  sections: [
 {
title: 'Thezy X Fauzialifatah',
highlight_label: '',
rows: [
  {
 header: '⌬ Message Owner',
 title: '└ Menampilkan Menu Owner',
 description: `${global.namabot}`, 
 id: '',
  },
  {
 header: '⌬ Message Group',
 title: '└ Menampilkan Menu Owner',
 description: `${global.namabot}`, 
 id: '',
  },
],
 },
  ],
}),
 },
  },
  ],
  headerType: 1,
  viewOnce: true
})
conn.reply2(m.chat, 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg', m);
};
handler.help = ['tes'];
handler.command = /^(tes)$/i;
handler.tags = ['owner'];
handler.premium = false;
handler.limit = true;
module.exports = handler;