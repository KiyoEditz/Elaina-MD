const fs = require('fs');
const { createDatabaseBackup } = require('../lib/backup');

let handler = async (m, { conn, isROwner }) => {
    try {
        await m.reply('⏳ Sedang memproses backup database SQLite (checkpoint WAL)...');

        const backup = await createDatabaseBackup(global.db?.sqlite);
        const fileBuffer = fs.readFileSync(backup.path);
        const sizeKb = (backup.size / 1024).toFixed(2);
        const d = new Date();
        const dateStr = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });

        await conn.sendMessage(
            m.chat,
            {
                document: fileBuffer,
                mimetype: 'application/vnd.sqlite3',
                fileName: backup.filename,
                caption: `📦 *Backup Database SQLite Elaina-MD*\n📅 Tanggal: ${dateStr}\n📁 Ukuran: ${sizeKb} KB\n\n_File database SQLite ini dapat langsung digunakan untuk restore jika terjadi masalah._`,
            },
            { quoted: m }
        );

        // Hapus file backup sementara di folder tmp
        try { fs.unlinkSync(backup.path); } catch (_) {}
    } catch (error) {
        console.error('[backupdb command error]', error);
        m.reply(`❌ Terjadi kesalahan saat melakukan backup database:\n${error.message}`);
    }
};

handler.help = ['backupdb', 'backup'];
handler.tags = ['owner'];
handler.command = /^(backupdb|backup)$/i;
handler.owner = true;

module.exports = handler;
