/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Contributor by : selxyz (scrape) 
 • Jadwal Sholat 
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (m, { conn, usedPrefix, command, args }) => {
    const kota = (args[0]?.toLowerCase() || 'jakarta');
    try {
        const { data } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
        const $ = cheerio.load(data);

        const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

        if (jadwal.length === 7) {
            const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

            const zan = `
╭──[ *Jadwal Sholat* ]──✧
᎒⊸ *Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *Tanggal*: ${tanggal}

╭──[ *Waktu Sholat* ]──✧
᎒⊸ Subuh: ${subuh}
᎒⊸ Duha: ${duha}
᎒⊸ Dzuhur: ${dzuhur}
᎒⊸ Ashar: ${ashar}
᎒⊸ Maghrib: ${maghrib}
᎒⊸ Isya: ${isya}
╰────────────•`;

            await conn.reply(m.chat, zan, m);
        } else {
            await conn.reply(m.chat, 'Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.', m);
        }
    } catch (error) {
        await conn.reply(m.chat, 'error', m);
    }
};

handler.help = ['jadwalsholat <kota>']
handler.tags = ['tools']
handler.command = /^((jadwal)?sh?[oa]lat)$/i

module.exports = handler

/*
let { jadwalsholat } = require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix }) => {
  let d = new Date
  let locale = 'id'
  let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  if (!text) throw `ketik ${usedPrefix}jadwalsholat daerah/kota\n*Contoh*: ${usedPrefix}jadwalsholat surabaya`

  const res = await jadwalsholat(text)
  if (!res.today) throw 'Server Error.. Harap lapor owner'
  m.reply(`
Jadwal Sholat *${text}*
${week}, ${date}

${Object.entries(res.today).map(([name, data]) => `*${name}:* ${data}`).join('\n').trim()}
`.trim())
}
handler.help = ['jadwalsholat <kota>']
handler.tags = ['tools']
handler.command = /^((jadwal)?sh?[oa]lat)$/i

module.exports = handler
*/