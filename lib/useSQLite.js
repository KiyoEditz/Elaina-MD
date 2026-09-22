const Database = require('better-sqlite3');
const { Mutex } = require('async-mutex');
const { BufferJSON, initAuthCreds, proto } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');

/**
 * Adapter Autentikasi Baileys berbasis SQLite (auth.db)
 * Menyimpan kredensial dan ribuan sinyal kunci enkripsi ke dalam 1 file database
 * Menggantikan useMultiFileAuthState untuk mencegah penumpukan file JSON kecil dan file corrupt.
 * 
 * @param {string} folder Path direktori penyimpanan session (default: './session')
 * @returns {Promise<{ state: { creds: any, keys: any }, saveCreds: () => Promise<void>, db: any }>}
 */
module.exports = async function useSQLite(folder = './session') {
	const mutex = new Mutex();
	const ALLOWED_KEYS = new Set([
		'pre-key',
		'session',
		'sender-key',
		'app-state-sync-key',
		'app-state-sync-version'
	]);

	const dir = path.resolve(`${folder}/auth.db`);
	fs.mkdirSync(path.dirname(dir), { recursive: true });
	const db = new Database(dir);

	db.pragma('journal_mode = WAL');
	db.pragma('synchronous = NORMAL');
	db.pragma('temp_store = MEMORY');
	db.pragma('foreign_keys = ON');

	db.exec(`
		CREATE TABLE IF NOT EXISTS creds (
			id INTEGER PRIMARY KEY CHECK (id = 1),
			data TEXT NOT NULL,
			updated_at INTEGER
		);

		CREATE TABLE IF NOT EXISTS keys (
			category TEXT NOT NULL,
			id TEXT NOT NULL,
			data TEXT,
			updated_at INTEGER,
			PRIMARY KEY (category, id)
		);
	`);

	const stmtGetCreds = db.prepare(`SELECT data FROM creds WHERE id=1`);
	const stmtSetCreds = db.prepare(
		`INSERT OR REPLACE INTO creds
		 (id, data, updated_at)
		 VALUES (1, ?, ?)`
	);

	const stmtGetKey = db.prepare(
		`SELECT data FROM keys
		 WHERE category=? AND id=?`
	);
	const stmtSetKey = db.prepare(
		`INSERT OR REPLACE INTO keys
		 (category, id, data, updated_at)
		 VALUES (?, ?, ?, ?)`
	);
	const stmtDelKey = db.prepare(
		`DELETE FROM keys
		 WHERE category=? AND id=?`
	);

	const readCreds = async () =>
		mutex.runExclusive(() => {
			const row = stmtGetCreds.get();
			return row ? JSON.parse(row.data, BufferJSON.reviver) : null;
		});

	const writeCreds = async (credsToSave) =>
		mutex.runExclusive(() => {
			stmtSetCreds.run(JSON.stringify(credsToSave, BufferJSON.replacer), Date.now());
		});

	const readKey = async (category, id) =>
		mutex.runExclusive(() => {
			const row = stmtGetKey.get(category, id);
			if (!row) return null;

			let value = JSON.parse(row.data, BufferJSON.reviver);

			if (category === 'app-state-sync-key' && proto && proto.Message && proto.Message.AppStateSyncKeyData) {
				value = proto.Message.AppStateSyncKeyData.fromObject(value);
			}

			return value;
		});

	const writeKey = async (category, id, value) =>
		mutex.runExclusive(() => {
			stmtSetKey.run(category, id, JSON.stringify(value, BufferJSON.replacer), Date.now());
		});

	const removeKey = async (category, id) =>
		mutex.runExclusive(() => {
			stmtDelKey.run(category, id);
		});

	// Cek jika ada creds.json lama di folder untuk di-import otomatis
	const legacyCredsPath = path.join(path.dirname(dir), 'creds.json');
	let creds = await readCreds();

	if (!creds && fs.existsSync(legacyCredsPath)) {
		try {
			console.log(`[useSQLite] Mengimpor creds.json lama ke ${dir}...`);
			const legacyRaw = fs.readFileSync(legacyCredsPath, 'utf8');
			const parsedLegacy = JSON.parse(legacyRaw, BufferJSON.reviver);
			if (parsedLegacy) {
				await writeCreds(parsedLegacy);
				creds = parsedLegacy;
				console.log(`[useSQLite] Berhasil mengimpor creds.json ke auth.db.`);
			}
		} catch (err) {
			console.error(`[useSQLite] Gagal mengimpor creds.json:`, err.message);
		}
	}

	if (!creds) {
		creds = initAuthCreds();
	}

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const result = {};
					for (const id of ids) {
						result[id] = await readKey(type, id);
					}
					return result;
				},

				set: async (data) => {
					const tasks = [];
					for (const category in data) {
						if (!ALLOWED_KEYS.has(category)) continue;

						for (const id in data[category]) {
							const value = data[category][id];
							tasks.push(value ? writeKey(category, id, value) : removeKey(category, id));
						}
					}
					await Promise.all(tasks);
				},
			},
		},

		saveCreds: async () => {
			await writeCreds(creds);
		},

		db
	};
};
