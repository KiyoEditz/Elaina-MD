/*
   Silahkan Di Pakek
   Tapi Bantu Rapihin :v
   Buatan: Miaweers
*/

let handler = async (m, { conn, participants }) => {
  // Mengambil daftar pengguna premium dan memformatnya
  let prem = global.prems
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .filter(v => v !== conn.user.jid);

  let users = global.db.data.users;
  
  // Membuat pesan dengan daftar pengguna premium
  let message = `「 List User Premium 」\n\nTotal: ${prem.length}\n\n` +
    prem.map((v, i) => {
      // Cek apakah pengguna ada di dalam daftar peserta
      const isParticipant = participants.some(p => v === p.jid);
      const user = users[v] || {};  // Jika users[v] undefined, buat objek kosong untuk menghindari error
      const name = user.name || 'Unregistered';  // Nama default jika tidak ada nama
      const premDate = user.premdate || 0;

      // Tanggal berakhirnya premium
      const status = premDate < Date.now() ? 'Habis' : conn.msToDate(premDate - Date.now());

      // Format pesan untuk setiap pengguna
      return `${i + 1}. ${isParticipant ? `(${name}) wa.me/${v.split('@')[0]}` : `${name}`}\n*Tersisa:* ${status}`;
    }).join('\n\n');
  
  // Kirim pesan ke chat
  conn.reply(m.chat, message, m, { contextInfo: { mentionedJid: prem } });
}

handler.help = ['premlist'];
handler.tags = ['owner'];
handler.command = /^(listprem(ium)?|prem(ium)?list)$/i;

module.exports = handler;
/*
let handler = async (m, { conn, participants }) => {
  let prem = global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)
  let users = global.db.data.users
  conn.reply(m.chat, `「 List User Premium 」\n\nTotal: ${prem.length}\n\n` + prem.map((v, i) => i + 1 + `. ${participants.some(p => v === p.jid) ? `(${users[v].name}) wa.me/${v.split`@`[0]}` : `${users[v].name}`}` + `\n*Tersisa:* ${users[v] === undefined ? '' : users[v].premdate < new Date() * 1 ? 'Habis' : conn.msToDate(users[v].premdate - new Date() * 1)}`).join`\n\n`,
    m, { contextInfo: { mentionedJid: prem } })
}
handler.help = ['premlist']
handler.tags = ['owner']
handler.command = /^(listprem(ium)?|prem(ium)?list)$/i

module.exports = handler
*/