let handler = async (m, { conn, args }) => {
    const jids = Object.keys(global.db.data.users).filter(user => user.endsWith("@s.whatsapp.net")); // jangan ubah ini
    let media = null;
    let options = {};
    let backgroundColor = "#7ACAA7"; // default background color
    let text = args.join(' ').trim();

    // Deteksi akhirnya kalok ada opsi warna (kode HEX atau nama warna)
    const lastArg = args[args.length - 1];
    if (lastArg?.startsWith('#')) {
        const warnaInput = lastArg.slice(1); // buang tanda #
        if (/^[0-9a-fA-F]{6}$/.test(warnaInput)) {
            backgroundColor = `#${warnaInput}`;
            args.pop(); // hapus kode warna dari teks
        } else if (/^[a-zA-Z]+$/.test(warnaInput)) {
            const hex = mapColorNameToHex(warnaInput.toLowerCase());
            if (hex) {
                backgroundColor = hex;
                args.pop(); // hapus nama warna dari teks
            }
        }
        text = args.join(' ').trim();
    }

    // Cek apakah ada media langsung dikirim (tanpa reply)
    const isMedia = m.mtype === 'imageMessage' || m.mtype === 'videoMessage' || m.mtype === 'audioMessage';
    if (isMedia) {
        media = await m.download();
        if (m.mtype === 'imageMessage') {
            options = { image: media, caption: text || '' };
        } else if (m.mtype === 'videoMessage') {
            options = { video: media, caption: text || '' };
        } else if (m.mtype === 'audioMessage') {
            options = { audio: media, ptt: true };
        }
    }

    // Jika reply ke media
    else if (m.quoted && (m.quoted.mtype === 'imageMessage' || m.quoted.mtype === 'videoMessage' || m.quoted.mtype === 'audioMessage')) {
        const mime = m.quoted.mtype || m.quoted.mediaType;
        media = await m.quoted.download();
        if (mime.includes('image')) {
            options = {
                image: media,
                caption: text || m.quoted.text || '',
            };
        } else if (mime.includes('video')) {
            options = {
                video: media,
                caption: text || m.quoted.text || '',
            };
        } else if (mime.includes('audio')) {
            options = {
                audio: media,
                ptt: true,
            };
        }
    }

    // Kalau cuman teks
    else {
        if (!text) return m.reply(`Masukkan teks untuk status atau kirim media dengan caption atau reply media.\n\ngunakan .upswall <teks> #<hex/warna>. untuk custom background.\n\n*video, gambar, atau audio tidak akan memakai background*`);
        options = { text: text };
    }

    // Kirim postingan ke status, bagian ini tidak diubah
    return conn.sendMessage("status@broadcast", options, {
        backgroundColor: backgroundColor,
        textArgb: 0xffffffff,
        font: 1,
        statusJidList: await Object.keys(global.db.data.users).filter(user => user.endsWith("@s.whatsapp.net")),
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: jids.map((jid) => ({
                            tag: "to",
                            attrs: { jid: m.chat },
                            content: undefined,
                        })),
                    },
                ],
            },
        ],
    });
};

// Warna dari nama ke hex
function mapColorNameToHex(name) {
    const colors = {
        merah: '#FF0000',
        biru: '#0000FF',
        hijau: '#008000',
        kuning: '#FFFF00',
        orange: '#FFA500',
        ungu: '#800080',
        putih: '#FFFFFF',
        hitam: '#000000',
        abu: '#808080',
        pink: '#FFC0CB',
        coklat: '#A52A2A',
        emas: '#FFD700',
        perak: '#C0C0C0',
    };
    return colors[name];
}

handler.help = ['upswall <teks?> #<warna?>'];
handler.command = ['upswall'];
handler.owner = true;

module.exports = handler;