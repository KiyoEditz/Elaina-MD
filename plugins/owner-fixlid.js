const { mergeLidUsers } = require('../lib/lidMerge');

let handler = async (m, { conn, usedPrefix, command }) => {
  await m.reply('🔍 _Sedang memindai grup dan memproses penggabungan data @lid ke nomor WhatsApp... Mohon tunggu._');
  try {
    const res = await mergeLidUsers(conn);
    const teks = `
*╭─「 LID MERGE REPORT 」─╮*
│
├ 📊 *Total LID Terpetakan:* ${res.totalMapped}
├ 👥 *User Berhasil Dimerge:* ${res.mergedCount}
├ 💬 *Chat Berhasil Dimerge:* ${res.chatMergedCount}
├ ⏳ *Sisa User @lid:* ${res.remainingLidUsers}
├ ⏳ *Sisa Chat @lid:* ${res.remainingLidChats}
│
*╰────────────────────╯*
${res.remainingLidUsers > 0 ? '\n_Catatan: Sisa akun @lid yang belum terpetakan akan otomatis dikonversi saat mereka berinteraksi atau saat bot memuat grup yang mereka ikuti._' : '\n_Semua data @lid telah bersih dan tergabung dengan nomor WhatsApp!_'}
`.trim();
    await m.reply(teks);
  } catch (e) {
    console.error(e);
    await m.reply(`❌ Terjadi kesalahan saat memproses migrasi LID: ${e.message}`);
  }
};

handler.help = ['fixlid', 'mergelid'];
handler.tags = ['owner'];
handler.command = /^(fixlid|mergelid)$/i;
handler.owner = true;

module.exports = handler;
