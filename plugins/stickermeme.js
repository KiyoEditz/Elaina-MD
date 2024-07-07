const uploadFile = require('../lib/uploadFile');
const uploadImage = require('../lib/uploadImage');
const { webp2png } = require('../lib/webp2mp4'); 
const { sticker } = require('../lib/sticker'); 

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!(/image\/(jpe?g|png)|webp/.test(mime))) throw `Kirim/reply gambar dengan caption/teks\n\nContoh:\n${usedPrefix + command} Hai | kamu`;

    let [t1, t2] = text.split('|');
    if (!t1) throw `Masukkan teks!\n\nContoh:\n ${usedPrefix + command} teks | kamu(optional)`;
    if (!t2) {
        t2 = t1;
        t1 = ''; 
    }
    let img = await q.download();
    let link;
    if (/webp/.test(mime)) {
        link = await webp2png(img);
    } else {
        link = await uploadImage(img).catch(e => uploadFile(img)); 
    }
    let hasil = global.API('https://api.memegen.link', `/images/custom/${encodeURIComponent(t1)}/${encodeURIComponent(t2)}.png`, {
        background: link
    }); 
    try {
        let stickerBuffer = await sticker(await fetch(hasil).then(v => v.buffer()), false, packname, author);
        conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m }); 
    } catch (e) {
        conn.sendFile(m.chat, hasil, 'error.png', 'Terjadi kesalahan saat membuat sticker :(\n\ngunakan fitur image to stiker\nketik .s atau .sticker', m); // Send as image if error
    }
  };
handler.help = ['smeme', 'stikermeme'].map(v => v + ' <teks|teks>')
handler.tags = ['stickerother']
handler.command = /^(s(tic?ker)?meme)$/i

module.exports = handler