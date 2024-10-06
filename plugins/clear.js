const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, command, args }) => {
  // Mengambil semua chat secara asinkron
  let allChats = await conn.chats.all();
  let chats;

  // Menentukan jenis chat berdasarkan argumen
  if (/group|gc/i.test(args[0])) {
    chats = allChats.filter(v => v.jid.endsWith('g.us') && !v.pin).map(v => v.jid);
  } else if (/chat|private/i.test(args[0])) {
    chats = allChats.filter(v => v.jid.endsWith('.net') && !v.pin).map(v => v.jid);
  } else if (/all/i.test(args[0])) {
    chats = allChats.filter(v => v.jid && !v.pin).map(v => v.jid);
  } else if (/left/i.test(args[0])) {
    chats = allChats.filter(v => v.read_only).map(v => v.jid);
  } else {
    chats = [m.chat];
  }

  // Menentukan aksi berdasarkan perintah
  let isDelete = /^delete/i.test(command);
  let isClear = /^clear/i.test(command);
  let isMute = /^mute/i.test(command);
  let isUnmute = /^unmute/i.test(command);

  for (let id of chats) {
    try {
      if (isDelete) {
        // Menghapus chat
        await conn.chatModify({ clear: true }, id);
      } else if (isClear) {
        // Membersihkan chat
        await conn.chatModify({ clear: true }, id);
      } else if (isUnmute) {
        // Membuka mute chat
        await conn.chatModify({ mute: null }, id);
      } else if (isMute) {
        // Mute chat selama 8 jam
        await conn.chatModify({ mute: 8 * 60 * 60 * 1000 }, id);
      }
      // Memberikan delay antara setiap operasi
      await delay(1500);
    } catch (error) {
      console.error(`Gagal memodifikasi chat ${id}:`, error);
    }
  }

  // Menyusun pesan balasan
  let action = isDelete ? 'dihapus' :
               isClear ? 'dibersihkan' :
               isMute ? 'dimuat' :
               isUnmute ? 'dibuka mute' : 'diproses';

  conn.reply(m.chat, `${chats.length} chat ${args[0] || ''} telah ${action}`, m);
};

// Menambahkan bantuan perintah
handler.help = [
  'clearchat',
  'clearchat chat',
  'clearchat group',
  'clearchat all',
  'deletechat',
  'deletechat chat',
  'deletechat group',
  'deletechat all',
  'mutechat',
  'mutechat chat',
  'mutechat group',
  'mutechat all',
  'unmute',
  'unmute chat',
  'unmute group',
  'unmute all'
];

// Menandai handler dengan tag dan perintah yang sesuai
handler.tags = ['owner'];
handler.command = /^(clear|delete|(un)?mute)chat$/i;
handler.owner = true;

// Mengekspor handler
module.exports = handler;