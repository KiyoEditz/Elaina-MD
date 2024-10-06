const fetch = require('node-fetch');
const { apivisit } = require('./kanghit.js');

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Input URL';
    let res = await twitterDl(text);
    await m.reply('_In progress, please wait..._');
    
    if (res.media && res.media.length > 0) {
        for (let x = 0; x < res.media.length; x++) {
            let caption = x === 0 ? res.caption.replace(/https:\/\/t.co\/[a-zA-Z0-9]+/gi, '').trim() : '';
            await conn.sendFile(m.chat, res.media[x].url, '', caption, m);
        }
    } else {
        throw 'No media found';
    }
    
    await apivisit;
};

handler.help = ['twitter'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.alias = ['x', 'twitter'];
handler.command = /^(x|twitter)$/i;

module.exports = handler;

async function twitterDl(url) {
    // Tambahkan regex untuk mendukung x.com
    let idMatch = /(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/.exec(url);
    
    if (!idMatch || !idMatch[1]) throw 'Invalid URL';
    let id = idMatch[1];

    let res = await fetch(`https://tweetpik.com/api/tweets/${id}`);
    
    if (res.status !== 200) throw res.statusText;
    let json = await res.json();

    if (json.media && json.media.length > 0) {
        let media = [];
        for (let i of json.media) {
            if (/video|animated_gif/.test(i.type)) {
                let vid = await (await fetch(`https://tweetpik.com/api/tweets/${id}/video`)).json();
                vid = vid.variants.pop(); // Mengambil varian terakhir (kualitas tertinggi)
                media.push({
                    url: vid.url,
                    type: i.type
                });
            } else {
                media.push({
                    url: i.url,
                    type: i.type
                });
            }
        }
        return {
            caption: json.text,
            media
        };
    } else {
        throw 'No media found';
    }
}