const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cheerio = require("cheerio");

class Komikcast {
    async search(query) {
        try {
            const response = await axios.get(`https://komikcast.cz/?s=${encodeURIComponent(query)}`);
            const $ = cheerio.load(response.data);
            const result = [];

            $(".list-update_item").each((_, element) => {
                result.push({
                    title: $(element).find(".title").text().trim(),
                    link: $(element).find("a").attr("href"),
                });
            });

            return result.length > 0 ? result : null;
        } catch (error) {
            console.error("Error during search:", error);
            return null;
        }
    }

    async chapter(url) {
        try {
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);
            const chapters = [];

            $(".komik_info-chapters-item").each((index, element) => {
                const chapterNumber = $(element)
                    .find(".chapter-link-item")
                    .text()
                    .trim()
                    .replace(/\s+/g, " ");
                const chapterURL = $(element)
                    .find(".chapter-link-item")
                    .attr("href");
                const timeAgo = $(element)
                    .find(".chapter-link-time")
                    .text()
                    .trim();

                chapters.push({
                    number: chapterNumber,
                    url: chapterURL,
                    timeAgo: timeAgo,
                });
            });

            return chapters;
        } catch (error) {
            console.error("Error saat mengambil chapter:", error);
            throw error;
        }
    }

    async detail(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            let result = {};
            result.title = $('.komik_info-content h1').text().trim();
            result.alternativeTitle = $('.komik_info-content-native').text().trim();
            result.image = $('.komik_info-cover-image img').attr('src');
            result.synopsis = $('.komik_info-description-sinopsis p').text().trim();
            result.lastUpdated = $('.komik_info-content-update time').attr('datetime');
            result.genres = $('.komik_info-content-genre a')
                .map((i, el) => $(el).text().trim())
                .get();

            result.released = $('.komik_info-content-released').text().trim();
            result.author = $('.komik_info-content-author').text().trim();
            result.status = $('.komik_info-content-status').text().trim();

            return result; 
        } catch (error) {
            console.error('Error:', error);
            return { error: 'Gagal mengambil data' };
        }
    }

    async createPdf(url, imageUrl) {
        // Buat folder tmp jika belum ada
        if (!fs.existsSync('tmp')) {
            fs.mkdirSync('tmp');
        }

        const pdfPath = `tmp/komik_${Date.now()}.pdf`;
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(14).text(`Komik dari URL: ${url}`, { align: 'center' });
        
        try {
            console.log(`Mengunduh gambar dari: ${imageUrl}`);
            const gambar = await axios.get(imageUrl, { responseType: 'arraybuffer', headers: { referer: 'https://komikcast.cz/' } });
            const imgBuffer = Buffer.from(gambar.data, 'binary');
            doc.image(imgBuffer, { fit: [500, 400], align: 'center' });
            console.log("Gambar berhasil diunduh dan dimasukkan ke PDF.");
        } catch (error) {
            console.error("Gagal mengunduh gambar:", error.message);
            doc.text("Gambar tidak tersedia", { align: 'center' });
        }

        doc.end(); // Menjamin doc.end() dipanggil
        console.log("PDF Path:", pdfPath);
        
        return pdfPath;
    }
}

const komikcast = new Komikcast();

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const input = text.split("#");

    switch (input[0]) {
        case "search":
            if (!input[1]) return m.reply("Masukkan judul komik");

            try {
                await m.reply("Tunggu sebentar...");
                const searchResults = await komikcast.search(input[1]);
                let caption = `Komikcast Search\n\nGunakan \n- ${usedPrefix}komikcast chapter#url\n- ${usedPrefix}komikcast detail#url\n\n`;

                if (searchResults) {
                    searchResults.forEach((result, index) => {
                        caption += `${index + 1}. ${result.title}\n${result.link}\n\n`;
                    });
                } else {
                    caption += "Tidak ada hasil yang ditemukan.";
                }

                await m.reply(caption);
            } catch (error) {
                console.error("Error during search:", error);
                await m.reply("Terjadi kesalahan saat mencari komik.");
            }
            break;

        case "chapter":
            if (!input[1]) return m.reply("Masukkan URL komikcast");

            try {
                await m.reply("Tunggu sebentar...");
                const chapters = await komikcast.chapter(input[1]);
                let caption = `Komikcast Chapter\n\nGunakan ${usedPrefix}komikcast pdf#url\n\n`;

                chapters.forEach((chapter, index) => {
                    caption += `${index + 1}. ${chapter.number}: ${chapter.url}\n`;
                });

                await m.reply(caption);
            } catch (error) {
                console.error("Error fetching chapter:", error);
                await m.reply("Terjadi kesalahan saat mengambil chapter.");
            }
            break;

        case "detail":
            if (!input[1]) return m.reply("Masukkan URL komikcast");

            try {
                await m.reply("Tunggu sebentar...");
                const detailData = await komikcast.detail(input[1]);
                const detailCaption = generateCaption(detailData);

                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: detailData.image },
                        caption: detailCaption,
                    },
                    { quoted: m }
                );
            } catch (error) {
                console.error("Error fetching detail:", error);
                await m.reply("Terjadi kesalahan saat mengambil detail.");
            }
            break;

        case "pdf":
            if (!input[1]) return m.reply("Masukkan URL dari komikcast");

            try {
                await m.reply("Tunggu sebentar...");
                const komikUrl = input[1];
                const imageUrl = 'URL_GAMBAR_DINAMIS'; 
                const pdfPath = await komikcast.createPdf(komikUrl, imageUrl);
                const pdfBuffer = fs.readFileSync(pdfPath);

                await conn.sendFile(m.chat, pdfBuffer, 'komik.pdf', `PDF untuk ${komikUrl}`, m);
                fs.unlinkSync(pdfPath);
            } catch (error) {
                console.error("Error generating PDF:", error.message);
                await m.reply("Terjadi kesalahan saat membuat PDF.");
            }
            break;

        default:
            await m.reply(`Perintah tidak dikenal. Gunakan:\n${usedPrefix}komikcast search#judul\n${usedPrefix}komikcast chapter#url\n${usedPrefix}komikcast detail#url\n${usedPrefix}komikcast pdf#url`);
    }
};

const generateCaption = (data) => {
    return `Judul: ${data.title}\nAlternatif: ${data.alternativeTitle}\nGenre: ${data.genres.join(", ")}\nStatus: ${data.status}\nSinopsis: ${data.synopsis}`;
};

handler.help = handler.command = ['komikcast'];
handler.tags = ['anime'];

module.exports = handler;