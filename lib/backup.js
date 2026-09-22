const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Membuat backup file SQLite database secara aman (online WAL-checkpointed)
 * @param {object} sqliteInstance instance better-sqlite3
 * @returns {Promise<{ path: string, filename: string, size: number }>}
 */
async function createDatabaseBackup(sqliteInstance) {
    const tmpDir = path.resolve('./tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFileName = `database_backup_${timestamp}.db`;
    const backupFilePath = path.join(tmpDir, backupFileName);

    if (sqliteInstance && typeof sqliteInstance.backup === 'function') {
        // Native better-sqlite3 online backup (aman dari data corrupt saat bot aktif menulis ke WAL)
        await sqliteInstance.backup(backupFilePath);
    } else {
        // Fallback: salin file database.db atau database.json jika instance belum siap
        const sourcePath = fs.existsSync('./data/database.db') 
            ? './data/database.db' 
            : (fs.existsSync('./database.json') ? './database.json' : null);

        if (!sourcePath) {
            throw new Error('File database tidak ditemukan untuk di-backup');
        }
        fs.copyFileSync(sourcePath, backupFilePath);
    }

    const stats = fs.statSync(backupFilePath);
    return {
        path: backupFilePath,
        filename: backupFileName,
        size: stats.size
    };
}

/**
 * Membuat file zip dari script bot (mengabaikan node_modules, .git, tmp, dll)
 * @param {string} customFileName nama file zip output (opsional)
 * @returns {Promise<{ path: string, filename: string, size: number }>}
 */
function createScriptBackup(customFileName) {
    return new Promise((resolve, reject) => {
        const tmpDir = path.resolve('./tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const zipFileName = customFileName || `BackupScript_${timestamp}.zip`;
        const zipFilePath = path.join(tmpDir, zipFileName);

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            const stats = fs.statSync(zipFilePath);
            resolve({
                path: zipFilePath,
                filename: zipFileName,
                size: stats.size
            });
        });

        archive.on('error', (err) => {
            if (fs.existsSync(zipFilePath)) {
                try { fs.unlinkSync(zipFilePath); } catch (_) {}
            }
            reject(err);
        });

        archive.pipe(output);

        // Tambahkan seluruh file di root direktori dengan pengecualian
        archive.glob('**/*', {
            cwd: path.resolve('.'),
            ignore: [
                'node_modules/**',
                '.git/**',
                '.vs/**',
                '.vscode/**',
                'tmp/**',
                '*.zip',
                '*.tar.gz',
                '*.log',
                '.npm/**'
            ],
            dot: true
        });

        archive.finalize();
    });
}

module.exports = {
    createDatabaseBackup,
    createScriptBackup
};
