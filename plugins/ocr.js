const uploadImage = require("../lib/uploadImage");
const fetch = require("node-fetch");
const tesseract = require("node-tesseract-ocr");

let handler = async (m, { usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!mime) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command} teks`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Kirim/reply gambar`;
    let img = await q.download();
    let url = await uploadImage(img);
    tesseract
        .recognize(url, {
            lang: "eng",
            oem: 1,
            psm: 3,
        })
        .then((text) => {
            //console.log("Result:", text);
            m.reply(text);
        })
        .catch((error) => {
            console.log(error.message);
            throw 'Server Error..'
        });
};
handler.help = ["ocr"];
handler.tags = ["tools"];
handler.command = /^ocr$/i;

handler.limit = true;

module.exports = handler;