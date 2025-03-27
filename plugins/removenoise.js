const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');

function cyphereddata(t, r = "cryptoJS") {
    t = t.toString();
    const e = crypto.randomBytes(32);
    const a = crypto.randomBytes(16);
    const i = crypto.pbkdf2Sync(r, e, 999, 32, 'sha512');
    const cipher = crypto.createCipheriv('aes-256-cbc', i, a);
    let encrypted = cipher.update(t, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return JSON.stringify({
        amtext: encrypted,
        slam_ltol: e.toString('hex'),
        iavmol: a.toString('hex')
    });
}

const NoiseRemover = {
    async run(buffer) {
        const timestamp = Math.floor(Date.now() / 1000);
        const encryptedData = JSON.parse(cyphereddata(timestamp));

        const formData = new FormData();
        formData.append('media', buffer, { filename: crypto.randomBytes(3).toString('hex') + '_halo.mp3' });
        formData.append('fingerprint', crypto.randomBytes(16).toString('hex'));
        formData.append('mode', 'pulse');
        formData.append('amtext', encryptedData.amtext);
        formData.append('iavmol', encryptedData.iavmol);
        formData.append('slam_ltol', encryptedData.slam_ltol);

        const response = await axios.post(
            'https://noiseremoval.net/wp-content/plugins/audioenhancer/requests/noiseremoval/noiseremovallimited.php',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "accept": "*/*",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "Referer": "https://noiseremoval.net/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            }
        );

        return response.data;
    },
};

const handler = async (m, { conn, args }) => {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (!/audio|video/.test(mime)) {
            return m.reply('Kirim/Reply audio atau video yang ingin dihilangkan noisenya');
        }
        
        m.reply('Sedang memproses audio, mohon tunggu...');
        
        const media = await quoted.download();
        const result = await NoiseRemover.run(media);
        
        if (result.error) {
            return m.reply(`Gagal menghilangkan noise: ${result.message}`);
        }
        
        const enhancedAudioUrl = result.media.enhanced.uri;
        const originalAudioUrl = result.media.original.uri;
        
        const inpo = `*Noise Removal Successful*

*⭐ Info Audio*
- Original : ${originalAudioUrl}
- Enhanced : ${enhancedAudioUrl}

*📊 Status*
- Status : ${result.flag}
- Message : ${result.message}
- Worker : ${result.worker}`;

        await conn.sendMessage(m.chat, {
            audio: { url: enhancedAudioUrl },
            mimetype: 'audio/mp4',
            fileName: 'enhanced-audio.mp3',
            ptt: true //False Kalau Mau Audio
        }, { quoted: m });
        
        m.reply(inpo);
        
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses audio');
    }
};

handler.help = ['removenoise'];
handler.command = ['removenoise', 'cleanaudio', 'noiseless'];
handler.tags = ['audio'];

module.exports = handler;