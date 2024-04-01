let cheerio = require('cheerio')
let fetch = require('node-fetch')

let timeout = 120000
let poin = 1000
let handler = async (m, {
    conn,
    command,
    usedPrefix
}) => {
    conn.tebakkabupaten = conn.tebakkabupaten ? conn.tebakkabupaten : {}
    let id = m.chat
    if (id in conn.tebakkabupaten) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkabupaten[id][0])
        throw false
    }

    let json = await getRandomKabupaten()
    let caption = `*${command.toUpperCase()}*
Kabupaten apakah ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hkab untuk bantuan
Bonus: ${poin} XP
*Balas Pesan Ini Untuk Menjawab!*
    `.trim()
    conn.tebakkabupaten[id] = [
        await conn.sendFile(m.chat, json.url, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkabupaten[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakkabupaten[id][0])
            delete conn.tebakkabupaten[id]
        }, timeout)
    ]
}
handler.help = ['tebakkabupaten']
handler.tags = ['game']
handler.command = /^tebakkabupaten/i

module.exports = handler


const baseUrl = 'https://id.m.wikipedia.org';
async function getRandomKabupaten() {
    try {
        const response = await fetch(baseUrl + '/wiki/Daftar_kabupaten_di_Indonesia');
        const html = await response.text();
        const $ = cheerio.load(html);

        const kabupatenList = $('td a[href^="/wiki/Kabupaten"]').map((index, element) => ({
            link: baseUrl + $(element).attr('href'),
            name: $(element).attr('title')
        })).get().filter(item => item.link && item.name);

        if (kabupatenList.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * kabupatenList.length);
        const randomKabupaten = kabupatenList[randomIndex];

        const imageUrl = await fetchImageUrl(randomKabupaten.link);
        const judul = randomKabupaten.name;
        const judulBaru = judul.replace('Kabupaten ', '');
        const linkGambar = imageUrl;
        const ukuranBaru = linkGambar.replace(/\/\d+px-/, '/1080px-');

        return {
            link: randomKabupaten.link,
            title: judulBaru,
            url: ukuranBaru
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchImageUrl(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        return 'https:' + $('tr.mergedtoprow td.infobox-full-data.maptable div.ib-settlement-cols-row div.ib-settlement-cols-cell a.mw-file-description img.mw-file-element').attr('src') || null;
    } catch (error) {
        return null;
    }
}