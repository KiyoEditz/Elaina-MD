const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Daftar kolom yang bertipe boolean agar saat di-load dari SQLite (0/1) kembali menjadi boolean true/false
const BOOLEAN_KEYS = new Set([
  'premium',
  'banned',
  'registered',
  'public',
  'autoread',
  'anticall',
  'gconly',
  'isBanned',
  'antispam',
  'game',
  'autolevelup',
  'useDocument',
  'trial',
  'permanent'
]);

// Kolom bertipe string / teks
const TEXT_KEYS = new Set([
  'name',
  'role',
  'pasangan',
  'afkReason'
]);

/**
 * Inisialisasi koneksi SQLite dan pembuatan tabel
 */
function initDatabase(dbPath = './data/database.db') {
  const fullPath = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const db = new Database(fullPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('wal_autocheckpoint = 1000');

  // Buat tabel-tabel utama
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      jid TEXT PRIMARY KEY,
      name TEXT DEFAULT '',
      "limit" INTEGER DEFAULT 20,
      exp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      role TEXT DEFAULT 'Beginner',
      skata INTEGER DEFAULT 0,
      suit INTEGER DEFAULT 0,
      pasangan TEXT DEFAULT '',
      premium INTEGER DEFAULT 0,
      premiumTime INTEGER DEFAULT 0,
      banned INTEGER DEFAULT 0,
      registered INTEGER DEFAULT 0,
      age INTEGER DEFAULT -1,
      regTime INTEGER DEFAULT -1,
      unreg INTEGER DEFAULT 0,
      lastclaim INTEGER DEFAULT 0,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS chats (
      jid TEXT PRIMARY KEY,
      isBanned INTEGER DEFAULT 0,
      antispam INTEGER DEFAULT 0,
      game INTEGER DEFAULT 1,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      public INTEGER DEFAULT 1,
      autoread INTEGER DEFAULT 0,
      anticall INTEGER DEFAULT 0,
      gconly INTEGER DEFAULT 1,
      data TEXT DEFAULT '{}',
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS stats (
      command TEXT PRIMARY KEY,
      total INTEGER DEFAULT 0,
      success INTEGER DEFAULT 0,
      last INTEGER DEFAULT 0,
      lastSuccess INTEGER DEFAULT 0,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS msgs (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sticker (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS extra (
      key TEXT PRIMARY KEY,
      data TEXT,
      updated_at INTEGER
    );
  `);

  return db;
}

/**
 * Mendapatkan daftar kolom yang ada pada tabel
 */
function getTableColumns(db, tableName) {
  const rows = db.prepare(`PRAGMA table_info("${tableName}")`).all();
  return new Set(rows.map(r => r.name));
}

/**
 * Auto-Column Migration: Otomatis menambah kolom ke samping kanan
 * jika ada properti baru bertipe primitif (string, number, boolean).
 */
function ensureUserColumns(db, knownCols, userObj) {
  let altered = false;
  for (const [key, val] of Object.entries(userObj)) {
    if (key === 'jid' || key === 'data' || key === 'updated_at') continue;
    if (knownCols.has(key)) continue;

    // Hanya buat kolom terpisah untuk tipe primitif (string, number, boolean)
    const type = typeof val;
    let colType = null;
    let defaultVal = "''";

    if (type === 'number') {
      colType = 'INTEGER';
      defaultVal = '0';
    } else if (type === 'boolean') {
      colType = 'INTEGER';
      defaultVal = '0';
      BOOLEAN_KEYS.add(key);
    } else if (type === 'string') {
      colType = 'TEXT';
      defaultVal = "''";
      TEXT_KEYS.add(key);
    }

    if (colType && /^[a-zA-Z0-9_]+$/.test(key)) {
      try {
        db.prepare(`ALTER TABLE users ADD COLUMN "${key}" ${colType} DEFAULT ${defaultVal}`).run();
        knownCols.add(key);
        altered = true;
        console.log(`[DB Auto-Migration] Menambahkan kolom baru ke tabel users: "${key}" (${colType})`);
      } catch (err) {
        if (!err.message.includes('duplicate column name')) {
          console.error(`[DB Auto-Migration Error] Gagal menambah kolom "${key}":`, err.message);
        } else {
          knownCols.add(key);
        }
      }
    }
  }
  return altered;
}

/**
 * Membaca seluruh data dari SQLite ke objek RAM global.db.data
 */
function loadDatabase(db) {
  const data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    sessions: {},
    menfess: {},
    chara: ''
  };

  // 1. Load Users
  const userRows = db.prepare('SELECT * FROM users').all();
  for (const row of userRows) {
    const jid = row.jid;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }

    const user = { ...extra };
    for (const [col, val] of Object.entries(row)) {
      if (col === 'jid' || col === 'data' || col === 'updated_at') continue;
      if (val === null || val === undefined) continue;

      if (BOOLEAN_KEYS.has(col)) {
        user[col] = Boolean(val);
      } else {
        user[col] = val;
      }
    }
    data.users[jid] = user;
  }

  // 2. Load Chats
  const chatRows = db.prepare('SELECT * FROM chats').all();
  for (const row of chatRows) {
    const jid = row.jid;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }
    data.chats[jid] = {
      ...extra,
      isBanned: Boolean(row.isBanned),
      antispam: Boolean(row.antispam),
      game: Boolean(row.game)
    };
  }

  // 3. Load Settings
  const settingRows = db.prepare('SELECT * FROM settings').all();
  for (const row of settingRows) {
    const id = row.id;
    let extra = {};
    if (row.data) {
      try {
        extra = JSON.parse(row.data);
      } catch {}
    }
    data.settings[id] = {
      ...extra,
      public: Boolean(row.public),
      autoread: Boolean(row.autoread),
      anticall: Boolean(row.anticall),
      gconly: Boolean(row.gconly)
    };
  }

  // 4. Load Stats
  const statRows = db.prepare('SELECT * FROM stats').all();
  for (const row of statRows) {
    data.stats[row.command] = {
      total: row.total,
      success: row.success,
      last: row.last,
      lastSuccess: row.lastSuccess,
    };
  }

  // 5. Load Msgs
  const msgRows = db.prepare('SELECT * FROM msgs').all();
  for (const row of msgRows) {
    try {
      data.msgs[row.key] = JSON.parse(row.data);
    } catch {
      data.msgs[row.key] = row.data;
    }
  }

  // 6. Load Sticker
  const stickerRows = db.prepare('SELECT * FROM sticker').all();
  for (const row of stickerRows) {
    try {
      data.sticker[row.key] = JSON.parse(row.data);
    } catch {
      data.sticker[row.key] = row.data;
    }
  }

  // 7. Load Extra (sessions, menfess, chara, dll.)
  const extraRows = db.prepare('SELECT * FROM extra').all();
  for (const row of extraRows) {
    try {
      data[row.key] = JSON.parse(row.data);
    } catch {
      data[row.key] = row.data;
    }
  }

  return data;
}

/**
 * Menyimpan data dari RAM global.db.data ke SQLite secara batch dan cepat
 */
function saveDatabase(db, data) {
  if (!db || !data) return;

  const now = Date.now();
  const knownCols = getTableColumns(db, 'users');

  // Periksa apakah ada kolom baru yang perlu ditambahkan secara dinamis
  if (data.users) {
    for (const user of Object.values(data.users)) {
      if (user && typeof user === 'object') {
        ensureUserColumns(db, knownCols, user);
      }
    }
  }

  // Siapkan query dinamis untuk users berdasarkan kolom yang ada
  const userCols = Array.from(knownCols).filter(c => c !== 'jid' && c !== 'data' && c !== 'updated_at');
  const allUserCols = ['jid', ...userCols, 'data', 'updated_at'];
  const userColsEscaped = allUserCols.map(c => `"${c}"`).join(', ');
  const userPlaceholders = allUserCols.map(() => '?').join(', ');
  const userUpdateSet = ['data = excluded.data', 'updated_at = excluded.updated_at', ...userCols.map(c => `"${c}" = excluded."${c}"`)].join(', ');

  const upsertUser = db.prepare(`
    INSERT INTO users (${userColsEscaped})
    VALUES (${userPlaceholders})
    ON CONFLICT(jid) DO UPDATE SET ${userUpdateSet}
  `);

  const upsertChat = db.prepare(`
    INSERT INTO chats (jid, isBanned, antispam, game, data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(jid) DO UPDATE SET
      isBanned = excluded.isBanned,
      antispam = excluded.antispam,
      game = excluded.game,
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertSetting = db.prepare(`
    INSERT INTO settings (id, public, autoread, anticall, gconly, data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      public = excluded.public,
      autoread = excluded.autoread,
      anticall = excluded.anticall,
      gconly = excluded.gconly,
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertStat = db.prepare(`
    INSERT INTO stats (command, total, success, last, lastSuccess, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(command) DO UPDATE SET
      total = excluded.total,
      success = excluded.success,
      last = excluded.last,
      lastSuccess = excluded.lastSuccess,
      updated_at = excluded.updated_at
  `);

  const upsertMsg = db.prepare(`
    INSERT INTO msgs (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertSticker = db.prepare(`
    INSERT INTO sticker (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  const upsertExtra = db.prepare(`
    INSERT INTO extra (key, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);

  // Eksekusi semua penulisan dalam 1 atomic transaction (super cepat < 15ms)
  const transaction = db.transaction(() => {
    // 1. Simpan Users
    if (data.users) {
      for (const [jid, user] of Object.entries(data.users)) {
        if (!user || typeof user !== 'object') continue;
        const extra = {};
        const values = [String(jid)];

        for (const col of userCols) {
          let val = user[col];

          if (TEXT_KEYS.has(col)) {
            // Kolom teks
            if (val === undefined || val === null) {
              val = col === 'role' ? 'Beginner' : '';
            } else if (typeof val === 'string') {
              val = val;
            } else if (typeof val === 'object') {
              val = JSON.stringify(val);
            } else {
              val = String(val);
            }
          } else {
            // Kolom numerik / boolean
            if (typeof val === 'boolean' || BOOLEAN_KEYS.has(col)) {
              val = val ? 1 : 0;
            } else if (val === undefined || val === null) {
              val = 0;
            } else if (typeof val === 'number') {
              val = isNaN(val) ? 0 : Math.floor(val);
            } else if (typeof val === 'string') {
              val = parseInt(val, 10) || 0;
            } else {
              // Jika tipe object / array berada di field kolom primitif
              extra[`_${col}_raw`] = val;
              val = 0;
            }
          }

          values.push(val);
        }

        // Kumpulkan properti non-kolom (objek kompleks/nested) ke extra
        for (const [k, v] of Object.entries(user)) {
          if (!knownCols.has(k)) {
            extra[k] = v;
          }
        }

        values.push(JSON.stringify(extra), now);
        upsertUser.run(...values);
      }
    }

    // 2. Simpan Chats
    if (data.chats) {
      for (const [jid, chat] of Object.entries(data.chats)) {
        if (!chat || typeof chat !== 'object') continue;
        const { isBanned, antispam, game, ...rest } = chat;
        upsertChat.run(
          String(jid),
          isBanned ? 1 : 0,
          antispam ? 1 : 0,
          game === false ? 0 : 1,
          JSON.stringify(rest),
          now
        );
      }
    }

    // 3. Simpan Settings
    if (data.settings) {
      for (const [id, setting] of Object.entries(data.settings)) {
        if (!setting || typeof setting !== 'object') continue;
        const { public: pub, autoread, anticall, gconly, ...rest } = setting;
        upsertSetting.run(
          String(id),
          pub === false ? 0 : 1,
          autoread ? 1 : 0,
          anticall ? 1 : 0,
          gconly === false ? 0 : 1,
          JSON.stringify(rest),
          now
        );
      }
    }

    // 4. Simpan Stats
    if (data.stats) {
      for (const [cmd, stat] of Object.entries(data.stats)) {
        if (!stat || typeof stat !== 'object') continue;
        upsertStat.run(
          String(cmd),
          Number(stat.total) || 0,
          Number(stat.success) || 0,
          Number(stat.last) || 0,
          Number(stat.lastSuccess) || 0,
          now
        );
      }
    }

    // 5. Simpan Msgs
    if (data.msgs) {
      for (const [k, v] of Object.entries(data.msgs)) {
        upsertMsg.run(String(k), JSON.stringify(v), now);
      }
    }

    // 6. Simpan Sticker
    if (data.sticker) {
      for (const [k, v] of Object.entries(data.sticker)) {
        upsertSticker.run(String(k), JSON.stringify(v), now);
      }
    }

    // 7. Simpan Extra (sessions, menfess, chara, dan key kustom lain)
    const primaryKeys = new Set(['users', 'chats', 'settings', 'stats', 'msgs', 'sticker']);
    for (const [k, v] of Object.entries(data)) {
      if (primaryKeys.has(k)) continue;
      upsertExtra.run(String(k), JSON.stringify(v), now);
    }
  });

  transaction();
}

/**
 * Memigrasikan data dari file database.json ke dalam SQLite database.db
 * PENTING: File database.json hanya dibaca secara read-only dan TIDAK AKAN dirusak/dihapus.
 */
function migrateFromJson(newDb, jsonPath = './database.json', force = false) {
  const fullJsonPath = path.resolve(jsonPath);
  if (!fs.existsSync(fullJsonPath)) {
    return { success: false, message: `File JSON tidak ditemukan: ${fullJsonPath}` };
  }

  // Cek apakah tabel users di newDb sudah terisi
  const userCount = newDb.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount > 0 && !force) {
    return {
      success: false,
      skipped: true,
      message: `Database SQLite sudah berisi ${userCount} users. Migrasi dilewati agar tidak menimpa data.`
    };
  }

  try {
    console.log(`[Migration] Membaca data dari: ${fullJsonPath} (read-only)...`);
    const rawData = fs.readFileSync(fullJsonPath, 'utf8');
    const jsonData = JSON.parse(rawData);

    const usersCount = Object.keys(jsonData.users || {}).length;
    const chatsCount = Object.keys(jsonData.chats || {}).length;
    const settingsCount = Object.keys(jsonData.settings || {}).length;
    const statsCount = Object.keys(jsonData.stats || {}).length;

    console.log(`[Migration] Mentransfer ${usersCount} users, ${chatsCount} chats, ${settingsCount} settings, ${statsCount} stats ke SQLite...`);
    saveDatabase(newDb, jsonData);

    const newUserCount = newDb.prepare('SELECT count(*) as count FROM users').get().count;
    const newChatCount = newDb.prepare('SELECT count(*) as count FROM chats').get().count;
    const newSettingCount = newDb.prepare('SELECT count(*) as count FROM settings').get().count;
    const newStatCount = newDb.prepare('SELECT count(*) as count FROM stats').get().count;
    const newExtraCount = newDb.prepare('SELECT count(*) as count FROM extra').get().count;

    console.log(`[Migration Berhasil] Users: ${newUserCount}, Chats: ${newChatCount}, Settings: ${newSettingCount}, Stats: ${newStatCount}, Extra: ${newExtraCount}`);
    return {
      success: true,
      users: newUserCount,
      chats: newChatCount,
      settings: newSettingCount,
      stats: newStatCount,
      extra: newExtraCount
    };
  } catch (err) {
    console.error('[Migration Error] Gagal melakukan migrasi dari JSON:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Menutup koneksi database SQLite dengan aman
 */
function closeDB(db) {
  if (db && typeof db.close === 'function') {
    try {
      db.close();
      console.log('[SQLite] Database connection closed.');
    } catch (err) {
      console.error('[SQLite] Error closing database:', err.message);
    }
  }
}

module.exports = {
  initDatabase,
  getTableColumns,
  ensureUserColumns,
  loadDatabase,
  saveDatabase,
  migrateFromJson,
  closeDB,
  BOOLEAN_KEYS,
  TEXT_KEYS
};
