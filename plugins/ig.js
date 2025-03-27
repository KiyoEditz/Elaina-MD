const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function igdl(url) {
    try {
        const { data } = await axios.get('https://snapinst.app/');
        const $ = cheerio.load(data);
        const form = new FormData();
        
        form.append('url', url);
        form.append('action', 'post');
        form.append('lang', '');
        form.append('cf-turnstile-response', '');
        form.append('token', $('input[name=token]').attr('value'));

        const headers = {
            ...form.getHeaders(),
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'Referer': 'https://snapinst.app/',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        };

        const response = await axios.post('https://snapinst.app/action2.php', form, { headers });
        const executeJS = new Function('callback', response.data.replace('eval', 'callback'));

        const html = await new Promise((resolve) => {
            executeJS((scriptResult) => {
                const extractedHTML = scriptResult.split(".innerHTML = ")[1].split("; document.")[0];
                resolve(eval(extractedHTML));
            });
        });

        const parsedHTML = cheerio.load(html);
        const result = {
            avatar: parsedHTML('.row img:eq(0)').attr('src'),
            username: parsedHTML('.row div.left:eq(0)').text().trim(),
            urls: []
        };

        parsedHTML('.row .download-item').each((i, e) => {
            result.urls.push(parsedHTML(e).find('.download-bottom a').attr('href'));
        });

        return result;
    } catch (error) {
        console.error("Error fetching Instagram media:", error);
        throw { status: 400, message: "Error fetching media" };
    }
}

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    let inputMessage = `[!] *Wrong Input*\n\nExample: ${usedPrefix + command} https://www.instagram.com/reel/CsC2PQCNgM1/`;

    if (!text) return m.reply(inputMessage);

    try {
        const mediaData = await igdl(text);
m.reply(JSON.stringify(mediaData, null, 2));
        if (!mediaData.urls.length) throw new Error("No media found");

        await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } });

        for (let mediaUrl of mediaData.urls) {
            await conn.sendFile(m.chat, mediaUrl, '', `乂 *I N S T A G R A M*\n\n*Result*: ${usedPrefix + command}\n*URL*: ${text}`, m, null, {
                asDocument: global.db.data.users[m.sender]?.useDocument
            });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Download error:", e);
        await conn.sendMessage(m.chat, { react: { text: '❎', key: m.key } });
        throw e;
    }
};

handler.help = ["ig"];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl)$/i;
handler.limit = true;

module.exports = handler;