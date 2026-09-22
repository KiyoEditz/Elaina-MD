const fs = require('fs');
const { createScriptBackup } = require('../lib/backup');

let handler = async (m, { conn, isROwner }) => {
    try {
        await m.reply('⏳ Sedang memproses backup script ke dalam file zip...\n_Harap tunggu sebentar, folder `node_modules`, `.git`, dan `tmp` akan diabaikan._');

        const backup = await createScriptBackup();
        const fileBuffer = fs.readFileSync(backup.path);
        const sizeMb = (backup.size / (1024 * 1024)).toFixed(2);
        const d = new Date();
        const dateStr = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });

        await conn.sendMessage(
            m.chat,
            {
                document: fileBuffer,
                mimetype: 'application/zip',
                fileName: backup.filename,
                caption: `📦 *Backup Script Elaina-MD*\n📅 Tanggal: ${dateStr}\n📁 Ukuran: ${sizeMb} MB\n\n_Silakan simpan file zip ini dengan aman._`,
            },
            { quoted: m }
        );

        // Hapus file zip sementara di folder tmp
        try { fs.unlinkSync(backup.path); } catch (_) {}
    } catch (error) {
        console.error('[backupsc command error]', error);
        m.reply(`❌ Terjadi kesalahan saat melakukan backup:\n${error.message}`);
    }
};

handler.help = ['backupsc'];
handler.tags = ['owner'];
handler.command = ['backupsc'];
handler.owner = true;

module.exports = handler;