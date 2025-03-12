const axios = require('axios');
const PDFDocument = require('pdfkit');
const { extractImageThumb } = require('@adiwajshing/baileys');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const handler = async (m, { conn, args }) => {
    let code = (args[0] || '').replace(/\D/g, '');
    if (!code) throw 'Input code';
    await m.reply('_In progress, please wait..._');

    let data = await nhentaiDL(code);
    if (!data) throw 'Failed to retrieve data';
    
    let pdf = await toPDF(data.images.pages);
    let jpegThumbnail = await extractImageThumb(pdf);

    await conn.sendMessage(m.chat, { 
        document: pdf, 
        jpegThumbnail, 
        fileName: data.title.english + '.pdf', 
        mimetype: 'application/pdf' 
    }, { quoted: m });
};

handler.command = handler.help = ['nhentai'];
handler.tags = ['nsfw'];
handler.limit = true;

module.exports = handler;

async function nhentaiDL(code) {
    try {
        const html = (await axios.get('https://nhentai.net/g/' + code)).data;
        const match = html.match(/JSON\.parse\((['"`])(.+?)\1\)/);
        
        const $ = cheerio.load(html);
        let images = [];
        $('.thumb-container').each((i, el) => {
            let url = $(el).find('.lazyload').attr('data-src')
                .replace('https://t', 'https://i')
                .replace((i + 1) + 't', (i + 1));
            images.push(url);
        });

        if (match) {
            let json = match[2]
                .replace(/\\"/g, '"')
                .replace(/\\u([\dA-Fa-f]{4})/g, (m, g) => String.fromCharCode(parseInt(g, 16)));
            
            let data = JSON.parse(json);
            data.images.pages = images;
            data.images.cover = $('meta[itemprop="image"]').attr('content');
            data.images.thumbnail = data.images.cover.replace('cover', 'thumb');
            data.tags = data.tags.map(tag => tag.name);
            
            return data;
        }
    } catch (e) {
        console.error('Error fetching data:', e);
    }
    return null;
}

function toPDF(images, opt = {}) {
    return new Promise(async (resolve, reject) => {
        if (!Array.isArray(images)) images = [images];
        let doc = new PDFDocument({ margin: 0, size: 'A4' });
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        for (let x = 0; x < images.length; x++) {
            if (!images[x]) continue;
            try {
                let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data;
                doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
                if (x + 1 < images.length) doc.addPage();
            } catch (err) {
                console.error('Failed to fetch image:', images[x], err.message);
            }
        }
        
        doc.end();
    });
}