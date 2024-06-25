
const fetch = require('node-fetch');

const fetchStickers = async (query) => {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getStickerSet?name=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.ok) { 
            throw new Error(data.description || 'Error fetching sticker set');
        }

        const stickers = data.result.stickers;
        const stickerRequests = stickers.map(sticker => ({
            file_id: sticker.file_id,
            url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${sticker.file_id}`, 
        }));

        return stickerRequests;
    } catch (error) {
        throw new Error('Terjadi kesalahan saat mengambil stiker.');
    }
};

const getRandomSticker = (stickers) => stickers[Math.floor(Math.random() * stickers.length)];

const handler = async (m, { conn, text, command }) => {
    const [query, count] = text.split('|').map(s => s.trim());

    if (!query) {
        return m.reply(`❗ Masukan tidak sesuai.\nGunakan format yang benar: ${command} [query]\n ${command} [query]|[angka]\n ${command} [query]|all\n ${command} [query]|random`);
    }

    try {
        const stickers = await fetchStickers(query);

        if (!stickers.length) {
            return m.reply('❗ Stiker tidak ditemukan.');
        }

        if (!count || count.toLowerCase() === 'random') {
            const randomSticker = getRandomSticker(stickers);
            return conn.sendFile(m.chat, randomSticker.url, '', '*Stiker Telegram (Acak)*', m);
        }

        if (count.toLowerCase() === 'all') {
            for (const sticker of stickers) { 
                await conn.sendFile(m.chat, sticker.url, '', '', m); 
                await new Promise(resolve => setTimeout(resolve, 1000)); 
            }
            return;
        }

        const stickerNumber = parseInt(count) - 1;
        if (isNaN(stickerNumber) || stickerNumber < 0 || stickerNumber >= stickers.length) {
            return m.reply('❗ Nomor stiker tidak valid.');
        }

        return conn.sendFile(m.chat, stickers[stickerNumber].url, '', `*Stiker Telegram (${stickerNumber + 1}/${stickers.length})*`, m);

    } catch (error) {
        console.error('Error fetching stickers:', error); 
        return m.reply('❗ Terjadi kesalahan saat mengambil stiker.');
    }
};

handler.help = ['stickertele [query]', 'stickertelegram [query]|[angka]', 'telesticker [query]|all', 'telegramsticker [query]|random'];
handler.tags = ['sticker'];
handler.command = /^(stickertele(gram)?|telesticker|telegramsticker)$/i;
handler.limit = 1;

module.exports = handler;
/*
const { sticker } = require('../lib/sticker.js')
const { stickerLine, stickerTelegram } = require('@bochilteam/scraper')

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // TODO: add stickerly
    const isTele = /tele/i.test(command)
    if (!args[0]) throw `*Perintah ini untuk mengambil stiker dari ${isTele ? 'Tele' : 'Line'}*\n\nContoh penggunaan:\n${usedPrefix + command} spongebob`
    const json = await (isTele ? stickerTelegram : stickerLine)(args[0])
    m.reply(`
Total stiker: ${(json[0]?.stickers || json).length}
`.trim())
    for (let data of (json[0]?.stickers || json)) {
        const stiker = await sticker(false, data.sticker || data, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m).catch(console.error)
        await delay(1500)
    }

}
handler.help = ['stikerline']
handler.tags = ['sticker']
handler.command = /^(stic?ker(line|tele(gram)?))$/i

handler.limit = true
module.exports = handler;

const delay = time => new Promise(res => setTimeout(res, time))
*/