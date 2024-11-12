const fs = require('fs');
const { readFileSync: read, unlinkSync: remove } = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { tmpdir } = require('os');

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;

    if (!mime || !/image/.test(mime)) {
        return conn.reply(m.chat, `Example: reply/send image with caption *${usedPrefix + command}*`, m);
    }

    try {
        // Mendapatkan path sementara untuk file hasil konversi
        let file = path.join(tmpdir(), `${Date.now()}.png`);
        let media = await conn.downloadAndSaveMediaMessage(q, path.join(tmpdir(), `${Date.now()}.webp`));

        // Eksekusi konversi dari webp ke png menggunakan ffmpeg
        exec(`ffmpeg -i ${media} ${file}`, async (err, stderr, stdout) => {
            if (err) {
                console.error("Error converting file:", err);
                return m.reply("Gagal mengonversi gambar.");
            }

            // Hapus file sumber setelah konversi selesai
            remove(media);

            // Baca file png yang sudah dikonversi
            const buffer = read(file);

            // Mengambil semua grup yang diikuti
            let getGroups = await conn.groupFetchAllParticipating();
            let groups = Object.values(getGroups);
            let anu = groups.map(group => group.id);

            conn.reply(m.chat, `_Mengirim pesan broadcast ke ${anu.length} chat_`, m);

            // Mengirim pesan broadcast ke semua grup
            for (let id of anu) {
                await delay(500);
                await conn.sendFile(id, buffer, `${Date.now()}.png`, pesan, m).catch(console.error);
            }

            // Memberi konfirmasi
            m.reply(`Sukses Mengirim Broadcast Ke ${anu.length} Group`);

            // Hapus file sementara setelah selesai
            remove(file);
        });
    } catch (e) {
        console.error(e);
        m.reply(`Terjadi Kesalahan!\nCode: ${e}`);
    }
};

handler.help = ['broadcastimg', 'bcimg'].map(v => v + ' <teks>');
handler.tags = ['owner'];
handler.command = /^(broadcastimg|bcimg)$/i;
handler.owner = true;

module.exports = handler;