const axios = require('axios');
const PDFDocument = require('pdfkit');
const { extractImageThumb } = require('@adiwajshing/baileys');
const fetch = require('node-fetch');

const handler = async (m, { conn, args }) => {
    let code = (args[0] || '').replace(/\D/g, '')
    if (!code) throw 'Input code';
    await m.reply('_In progress, please wait..._');

    let data = await nhentaiDL(code);
    let pdf = await toPDF(data.images.pages)

    await conn.sendMessage(m.chat, { document: imagepdf, jpegThumbnail, fileName: data.title.english + '.pdf', mimetype: 'application/pdf' }, { quoted: m });
};

handler.command = handler.help = ['nhentai'];
handler.tags = ['nsfw'];
handler.limit = true;

module.exports = handler;

async function nhentaiDL(code) {
try {
const html = (await axios.get('https://nhentai.net/g/' + code)).data
const match = html.match(/JSON\.parse\((['"`])(.+?)\1\)/)

const $ = cheerio.load(html)
let images = []
$('.thumb-container').each((i, el) => {
let url = $(el).find('.lazyload').attr('data-src').replace('https://t', 'https://i').replace((i + 1) + 't', (i + 1));
images.push(url);
});
if(match) {
let json = match[2].replace(/\\"/g, '"').replace(/\\u([\dA-Fa-f]{4})/g, (m, g) => String.fromCharCode(parseInt(g, 16)))
let data = JSON.parse(json)
data.images.pages = images
data.images.cover = $('meta[itemprop="image"]').attr('content')
data.images.thumbnail = data.images.cover.replace('cover', 'thumb')
data.tags = data.tags.map(tags => tags.name)

return data
}

} catch (e) {
console.log(e)
}
}

function toPDF(images, opt = {}) {
return new Promise(async (resolve, reject) => {
if (!Array.isArray(images)) images = [images]
let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' })
for (let x = 0; x < images.length; x++) {
if (!images[x]) continue // Skip jika URL kosong
try {
let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data
doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
if (images.length !== x + 1) doc.addPage()
} catch (err) {
console.error('Failed to fetch image:', images[x], err.message)
}
}

/*
const axios = require('axios');
const PDFDocument = require('pdfkit');
const { extractImageThumb } = require('@adiwajshing/baileys');
const fetch = require('node-fetch');

const handler = async (m, { conn, args }) => {
    let code = (args[0] || '').replace(/\D/g, '')
    if (!code) throw 'Input code';
    await m.reply('_In progress, please wait..._');

    let data = await nhentaiScraper(code);
    let pages = [];
    let thumb = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`;

    // Use a for loop for async operations
    for (let i = 0; i < data.images.pages.length; i++) {
        let v = data.images.pages[i];
        let ext = new URL(v.t).pathname.split('.')[1];
        pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`);
    }

    let buffer = await (await fetch(thumb)).buffer();
    let jpegThumbnail = await extractImageThumb(buffer);
    let imagepdf = await toPDF(pages);

    await conn.sendMessage(m.chat, { document: imagepdf, jpegThumbnail, fileName: data.title.english + '.pdf', mimetype: 'application/pdf' }, { quoted: m });
};

handler.command = handler.help = ['nhentai'];
handler.tags = ['nsfw'];
handler.limit = true;

module.exports = handler;

async function nhentaiScraper(id) {
    let uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/';
    let html = (await axios.get(uri)).data;
    return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data;
}

function toPDF(images, opt = {}) {
    return new Promise(async (resolve, reject) => {
        if (!Array.isArray(images)) images = [images];
        let buffs = [];
        let doc = new PDFDocument({ margin: 0, size: 'A4' });
        for (let x = 0; x < images.length; x++) {
            if (/.webp|.gif/.test(images[x])) continue;
            try {
                let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data;
                doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
                if (images.length !== x + 1) doc.addPage();
            } catch (err) {
                reject(err);
            }
        }
        doc.on('data', (chunk) => buffs.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffs)));
        doc.on('error', (err) => reject(err));
        doc.end();
    });
}
*/