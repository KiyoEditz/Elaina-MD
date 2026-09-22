const { deleteUser, deleteChat } = require('./sqliteDatabase');

/**
 * Normalisasi dan decode JID
 */
function cleanJid(jid, conn) {
  if (!jid) return '';
  if (typeof jid === 'object' && jid !== null) {
    jid = jid.id || jid.jid || jid.phoneNumber || jid.lid || '';
  }
  if (typeof jid !== 'string') return '';
  if (conn?.decodeJid) return conn.decodeJid(jid);
  return jid.replace(/:\d+@/, '@');
}

/**
 * Mengumpulkan semua mapping LID -> JID (@s.whatsapp.net)
 * dari bot session, owner config, group participating, dan database.
 */
async function collectLidMappings(conn) {
  const mapping = {};

  if (!global.db.data.lid) {
    global.db.data.lid = {};
  }

  // 1. Ambil dari database persistent mapping yang sudah tersimpan sebelumnya
  for (const [lid, jid] of Object.entries(global.db.data.lid)) {
    if (typeof lid === 'string' && typeof jid === 'string' && lid.endsWith('@lid') && jid.endsWith('@s.whatsapp.net')) {
      mapping[lid] = jid;
      if (conn?.isLid) conn.isLid.set(lid, jid);
    }
  }

  // 2. Bot sendiri (me.lid -> me.id)
  if (conn?.user) {
    const myLid = cleanJid(conn.user.lid, conn);
    const myJid = cleanJid(conn.user.id || conn.user.jid, conn);
    if (myLid && myJid && myLid.endsWith('@lid') && myJid.endsWith('@s.whatsapp.net')) {
      mapping[myLid] = myJid;
      global.db.data.lid[myLid] = myJid;
      if (conn?.isLid) conn.isLid.set(myLid, myJid);
    }
  }

  // 3. Owner LID yang diketahui
  // Dari database inspect: 276974253666525@lid adalah akun owner KiyoEditz
  const knownOwnerLid = '276974253666525@lid';
  const ownerNum = (global.owner?.[0] || '6285874068202').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  mapping[knownOwnerLid] = ownerNum;
  global.db.data.lid[knownOwnerLid] = ownerNum;
  if (conn?.isLid) conn.isLid.set(knownOwnerLid, ownerNum);

  // 4. Ambil dari semua grup yang diikuti bot (online)
  if (conn && typeof conn.groupFetchAllParticipating === 'function') {
    try {
      console.log('[LID-Merge] Mengambil data peserta grup untuk mapping LID...');
      const participating = await conn.groupFetchAllParticipating().catch(err => {
        console.warn('[LID-Merge] Gagal mengambil grup via API:', err.message);
        return null;
      });

      if (participating && typeof participating === 'object') {
        for (const [groupId, groupData] of Object.entries(participating)) {
          if (!conn.chats[groupId]) {
            conn.chats[groupId] = { id: groupId };
          }
          conn.chats[groupId].metadata = groupData;
          conn.chats[groupId].subject = groupData.subject || conn.chats[groupId].subject || '';

          const participants = groupData.participants || [];
          for (const p of participants) {
            const lid = cleanJid(p.lid, conn);
            let real = p.phoneNumber || p.jid || p.id;
            if (real) {
              real = cleanJid(real, conn);
              if (!real.includes('@')) real += '@s.whatsapp.net';
              if (lid && lid.endsWith('@lid') && real.endsWith('@s.whatsapp.net')) {
                mapping[lid] = real;
                global.db.data.lid[lid] = real;
                if (conn.isLid) conn.isLid.set(lid, real);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('[LID-Merge] Error saat fetch group metadata:', e);
    }
  }

  // 5. Cek juga conn.chats yang sudah ada di memory
  if (conn?.chats) {
    for (const chat of Object.values(conn.chats)) {
      const participants = chat?.metadata?.participants || chat?.participants;
      if (!Array.isArray(participants)) continue;
      for (const p of participants) {
        const lid = cleanJid(p.lid, conn);
        let real = p.phoneNumber || p.jid || p.id;
        if (real) {
          real = cleanJid(real, conn);
          if (!real.includes('@')) real += '@s.whatsapp.net';
          if (lid && lid.endsWith('@lid') && real.endsWith('@s.whatsapp.net')) {
            mapping[lid] = real;
            global.db.data.lid[lid] = real;
            if (conn.isLid) conn.isLid.set(lid, real);
          }
        }
      }
    }
  }

  return mapping;
}

/**
 * Merge satu user dari lidUser ke realUser dengan memprioritaskan stat tertinggi
 */
function mergeUserStats(lidUser, realUser, realJid) {
  if (!realUser) {
    return {
      ...lidUser,
      jid: realJid
    };
  }

  const lidLevel = Number(lidUser.level) || 0;
  const realLevel = Number(realUser.level) || 0;
  const isLidWinner = lidLevel > realLevel;

  // Base object: pilih pemenang level sebagai preferensi data profil
  const base = isLidWinner ? { ...realUser, ...lidUser } : { ...lidUser, ...realUser };

  // Ambil stat angka tertinggi dari kedua akun
  const merged = {
    ...base,
    jid: realJid,
    level: Math.max(lidLevel, realLevel),
    exp: Math.max(Number(lidUser.exp) || 0, Number(realUser.exp) || 0),
    limit: Math.max(Number(lidUser.limit) || 0, Number(realUser.limit) || 0),
    money: Math.max(Number(lidUser.money) || 0, Number(realUser.money) || 0),
    atm: Math.max(Number(lidUser.atm) || 0, Number(realUser.atm) || 0),
    bank: Math.max(Number(lidUser.bank) || 0, Number(realUser.bank) || 0),
    health: Math.max(Number(lidUser.health) || 0, Number(realUser.health) || 0),
    potion: Math.max(Number(lidUser.potion) || 0, Number(realUser.potion) || 0),
    premiumTime: Math.max(Number(lidUser.premiumTime) || 0, Number(realUser.premiumTime) || 0),
    premium: Boolean(lidUser.premium || realUser.premium),
    registered: Boolean(lidUser.registered || realUser.registered),
    role: isLidWinner ? (lidUser.role || realUser.role || 'Beginner') : (realUser.role || lidUser.role || 'Beginner'),
    name: (realUser.name && realUser.name !== 'owner') ? realUser.name : (lidUser.name || realUser.name || '')
  };

  return merged;
}

/**
 * Fungsi utama untuk menggabungkan user @lid yang sudah terpetakan ke nomor aslinya (@s.whatsapp.net)
 */
async function mergeLidUsers(conn) {
  if (!global.db?.data) {
    await global.loadDatabase();
  }

  const mappings = await collectLidMappings(conn);
  const mappingEntries = Object.entries(mappings);

  let mergedCount = 0;
  let deletedLidCount = 0;
  let chatMergedCount = 0;

  const users = global.db.data.users || {};
  const chats = global.db.data.chats || {};
  const dbSqlite = global.db.sqlite;

  for (const [lidJid, realJid] of mappingEntries) {
    // 1. Merge User
    if (users[lidJid]) {
      const lidUser = users[lidJid];
      const realUser = users[realJid] || null;

      const mergedUser = mergeUserStats(lidUser, realUser, realJid);
      users[realJid] = mergedUser;

      // Hapus data lid dari RAM
      delete users[lidJid];

      // Hapus data lid dari SQLite users table
      if (dbSqlite) {
        deleteUser(dbSqlite, lidJid);
      }

      mergedCount++;
      deletedLidCount++;
    }

    // 2. Merge Chat jika ada obrolan pribadi dengan @lid
    if (chats[lidJid]) {
      const lidChat = chats[lidJid];
      const realChat = chats[realJid] || {};
      chats[realJid] = { ...lidChat, ...realChat };

      delete chats[lidJid];
      if (dbSqlite) {
        deleteChat(dbSqlite, lidJid);
      }
      chatMergedCount++;
    }
  }

  // Hitung berapa akun @lid yang tersisa (belum terpetakan ke grup manapun)
  const remainingLidUsers = Object.keys(users).filter(j => j.endsWith('@lid')).length;
  const remainingLidChats = Object.keys(chats).filter(j => j.endsWith('@lid')).length;

  // Simpan perubahan ke SQLite
  await global.db.write();

  console.log(`[LID-Merge] Selesai: ${mergedCount} user digabung/dikonversi, ${chatMergedCount} chat digabung. Sisa @lid belum terpetakan: ${remainingLidUsers} users, ${remainingLidChats} chats.`);

  return {
    success: true,
    totalMapped: mappingEntries.length,
    mergedCount,
    deletedLidCount,
    chatMergedCount,
    remainingLidUsers,
    remainingLidChats
  };
}

module.exports = {
  mergeLidUsers,
  collectLidMappings,
  mergeUserStats
};
