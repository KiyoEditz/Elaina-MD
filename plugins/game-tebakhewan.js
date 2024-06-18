

let fetch = require('node-fetch');
let cheerio = require('cheerio');
let path = require('path');

let timeout = 120000
let poin = 1000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {}
    let id = m.chat
    if (id in conn.tebakhewan) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakhewan[id][0])
        throw false
    }
    
  let src = await tebakHewan()
  let json = src[Math.floor(Math.random() * src.length)]
  let caption = `*${command.toUpperCase()}*
hewan apakah ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}hhew* untuk bantuan
Bonus: *${poin} XP*
    `.trim()
    conn.tebakhewan[id] = [
        await conn.sendFile(m.chat, json.url, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakhewan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakhewan[id][0])
            delete conn.tebakhewan[id]
        }, timeout)
    ]
}
handler.help = ['tebakhewan']
handler.tags = ['game']

handler.command = ["tebakhewan"]
handler.game = true
handler.group = true

module.exports = handler

const buttons = [
    ['Hint', '/hhew'],
    ['Nyerah', 'menyerah']
]

async function tebakHewan() {
const randomPageNumber = Math.floor(Math.random() * 20) + 1;
const url = `https://rimbakita.com/daftar-nama-hewan-lengkap/${randomPageNumber}/`;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    return $('div.entry-content.entry-content-single img[class*=wp-image-][data-src]').map((_, element) => {
      const src = $(element).attr('data-src');
      const alt = path.basename(src, path.extname(src)).replace(/-/g, ' ');
      const capitalizedAlt = alt.charAt(0).toUpperCase() + alt.slice(1);
      return { title: capitalizedAlt, url: src };
    }).get();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};