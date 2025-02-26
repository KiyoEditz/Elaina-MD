/*
const fg = require('api-dylux'); 
const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://www.facebook.com/share/r/ZM2xDeQdQ5y31jR5/?mibextid=D5vuiz`;
  }
  try {
    if (!args[0].match(/facebook/gi)) {
      throw `Berikan URL dari Facebook!`;
    }
    conn.reply(m.chat, 'Tunggu sebentar...', m); 
    const response = await fg.fbdl(args[0]);
    const { videoUrl, size, title } = response;
    let vid = videoUrl;
    let caption = `⬣───「 *FACEBOOK* 」───⬣
○ Title: ${title}
○ Size: ${size}
○ VideoUrl: ${readMore}
${videoUrl}`;
    await conn.sendFile(m.chat, vid, 'facebook.mp4', caption, m, null, { asDocument: global.db.data.users[m.sender].useDocument });
  } catch (e) {
    throw '*Tidak Dapat Mengambil Informasi Url*';
  }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloder|dl)?)$/i;
module.exports = handler;

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

*/

const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function getmyfb(urlFb) {
  try {
    const form = new FormData();
    form.append('id', urlFb);
    form.append('locale', 'id');

    const response = await axios.post('https://getmyfb.com/process', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const $ = cheerio.load(response.data);
    const title = $('.results-item-text').text().trim() || 'No Title Found';
    const thumbnail = $('.results-item-image').attr('src') || '';
    const urlHd = $('.results-list li:nth-child(1) a').attr('href') || null;
    const urlSd = $('.results-list li:nth-child(2) a').attr('href') || null;

    if (!urlHd && !urlSd) {
      throw new Error('Failed to extract video links. It may be a private or unsupported video.');
    }

    return {
      title,
      thumb: thumbnail,
      video: { hd: urlHd, sd: urlSd },
    };
  } catch (error) {
    console.error('Error in getmyfb:', error.message);
    throw error;
  }
}

async function handler(m, { conn, args, usedPrefix, command }) {
  if (!args[0]) {
    return m.reply(`*Format:* ${usedPrefix}${command} <url Facebook>\n*Example:* ${usedPrefix}${command} https://www.facebook.com/share/r/ZM2xDeQdQ5y31jR5/?mibextid=D5vuiz`);
  }

  if (!args[0].match(/facebook|fb\.watch/gi)) {
    return m.reply('⚠️ Please provide a valid Facebook video URL.');
  }

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '⏳', key: m.key },
    });

    const result = await getmyfb(args[0]);
      conn.reply(result);
    let message = `*🎬 Video Found!*\n\n📌 *Title:* ${result.title}\n🔗 *Download Links:*`;
    if (result.video.hd) message += `\n▶ *HD:* ${result.video.hd}`;
    if (result.video.sd) message += `\n▶ *SD:* ${result.video.sd}`;

    if (result.thumb) {
      await conn.sendMessage(m.chat, { image: { url: result.thumb }, caption: message }, { quoted: m });
    } else {
      await m.reply(message);
    }

    if (result.video.hd) {
      await conn.sendMessage(m.chat, { video: { url: result.video.hd } }, { quoted: m });
    } else if (result.video.sd) {
      await conn.sendMessage(m.chat, { video: { url: result.video.sd } }, { quoted: m });
    } else {
      await m.reply('⚠️ No downloadable video found.');
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key },
    });
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error: ${error.message}`);
  }
}

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloader|dl)?)$/i;
handler.limit = false;

module.exports = handler;