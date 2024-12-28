/*
*[Plug Kristen jir]* 
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const fetch = require('node-fetch');
const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `uhm.. teksnya mana?\n\ncontoh:\n${usedPrefix + command} kejadian`;

  let res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
    }
  });

  let $ = cheerio.load(res.data);
  let result = [];
  $('div.vw').each(function (a, b) {
    let teks = $(b).find('p').text().trim();
    let link = $(b).find('a').attr('href');
    let title = $(b).find('a').text().trim();
    result.push({ teks, link, title });
  });

  let foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg';
  let judul = '*────────「 Alkitab 」 ────────*';
  let caption = result.map(v => `💌 ${v.title}\n📮 ${v.teks}`).join('\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n');

  conn.sendFile(m.chat, foto, 'alkitab.jpg', `${judul}\n\n${caption}`, m);
};

handler.help = ['alkitab'].map(v => v + ' <pencarian>');
handler.tags = ['internet'];
handler.command = /^(alkitab)$/i;

module.exports = handler;