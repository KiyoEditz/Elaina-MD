// mediafire downloader
// scraper by https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P/156

const { fetch } = require("undici");
const { lookup } = require("mime-types");
const cheerio = require("cheerio");

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`*• Example :* ${usedPrefix+command} *[mediafire url]*`);

    const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.+$/i;
    if (!mediafireRegex.test(text)) {
        return m.reply(`*• Example :* ${usedPrefix+command} *[mediafire url]*`);
    }

    m.reply("Downloading...");

    try {
        let result = await mediafire(text);

        let cpt = `*乂 MEDIAFIRE - DOWNLOADER*

   ◦ File Name : ${result.filename}
   ◦ Type : ${result.type}
   ◦ Size : ${result.size}`;

        let filename = result.filename;
        let url = result.download;

        await conn.sendFile(m.chat, url, filename, cpt, m, false, {
            mimetype: result.mimetype,
            fileName: filename,
        });
    } catch (e) {
        m.reply("Terjadi eror");
    }
};

handler.help = ["mediafire", "mf"].map((a) => a + " *mediafire url*");
handler.tags = ["downloader"];
handler.command = ["mediafire", "mf"];

module.exports = handler;

async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const type = $(".dl-btn-cont").find(".icon").attr("class").split("archive")[1].trim();
        const filename = $(".dl-btn-label").attr("title");
        const size = $('.download_link .input').text().trim().match(/\((.*?)\)/)[1];
        const ext = filename.split(".").pop();
        const mimetype =
            lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
        const download = $(".input").attr("href");
        resolve({
            filename,
            type,
            size,
            ext,
            mimetype,
            download,
        });
    }).catch((e) =>
        reject({
            msg: "Gagal mengambil data dari link tersebut",
        }),
    );
}