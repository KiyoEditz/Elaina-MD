const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("./lib/coklat.json")));


const handler = async (m, { args, conn, text, command, usedPrefix }) => {
  conn.ytmp3 = conn.ytmp3 || {};
  if (m.sender in conn.ytmp3) {
    return;
  }
  if (!text) throw `*Example:* ${usedPrefix + command} https://www.youtube.com/watch?v=Z28dtg_QmFw`
  conn.reply(m.chat, wait, m);
  conn.ytmp3[m.sender] = true;
  try {
    let info = await ytdl.getInfo(text, {agent});
    let durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
    let formattedDuration = new Date(durationSeconds * 1000).toISOString().substr(11, 8);
    let viewCount = parseInt(info.videoDetails.viewCount, 10);
    let formattedViewCount = viewCount >= 1000000
      ? (viewCount / 1000000).toFixed(1) + "Jt"
      : (viewCount / 1000).toFixed(0) + "Rb";
      let isi = `
╭──── 〔 Y O U T U B E 〕 ─⬣
 ⬡ *Title:* ${info.videoDetails.title}
 ⬡ *Channel:* ${info.videoDetails.author.name}
 ⬡ *Duration:* ${formattedDuration} 
 ⬡ *View:* ${formattedViewCount}
 ⬡ *Rating:* ${info.videoDetails.averageRating}
╰────────⬣`;
    let audio = ytdl(text, { quality: 'highestaudio' });
    let inputFilePath = './tmp/music.webm';
    let outputFilePath = './tmp/music.mp3';
    let url = text;
    let urlMatch = url.match(/(?:v=|be\/)([A-Za-z0-9-_]+)/i);
    let thumb = `https://i.ytimg.com/vi/${urlMatch[1]}/hqdefault.jpg`;
    audio.pipe(fs.createWriteStream(inputFilePath)).on('finish', async () => {
      ffmpeg(inputFilePath)
        .toFormat('mp3')
        .on('end', async () => {
          let buffer = fs.readFileSync(outputFilePath);
          conn.sendMessage(m.chat, { 
        image: { url: thumb }, 
        caption: isi
    }, { quoted: m });
       
conn.sendFile(m.chat, buffer, `${info.videoDetails.title}.mp3`, `*${info.videoDetails.title}*`, m, null, { asDocument: global.db.data.users[m.sender].useDocument });
///conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', fileName: `${info.videoDetails.title}.mp3`, asDocument: global.db.data.users[m.sender].useDocument }, { quoted: m });
          delete conn.ytmp3[m.sender];
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .on('error', (err) => {
          console.log(err);
          m.reply(`*Convert Error:* ${err.message}`);
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .save(outputFilePath);
    });
  } catch (e) {
    console.log(e);
    m.reply(`*Error:* ${e.message}`);
    m.reply(`*Mencoba matode lain!...*`);
    const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzElainaMD`);        
        const res = response.data.result;      
        var { mp3, id, title, source, duration, thumb } = res;
        let caption = `
╭──── 〔 Y O U T U B E 〕 ─⬣
 ⬡ *Title:* ${title}
 ⬡ *Id:* ${id}
 ⬡ *Duration:* ${duration} 
 ⬡ *Link:* ${source}
 ⬡ *Rating:* unknown
╰────────⬣`
    // Mengirim gambar dengan caption
    await conn.sendMessage(m.chat, { 
        image: { url: thumb }, 
        caption: caption
    }, { quoted: m });
    
        // await conn.sendFile(m.chat, mp3, null, m);
        await conn.sendMessage(m.chat, { 
            document: { url: mp3 }, 
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m });
  }
};

handler.command = handler.help = ['ytmp3','yta'];
handler.tags = ['downloader'];
handler.premium = false;
handler.limit = false;

module.exports = handler;
/*

let limit = 30

const { youtubedl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

let handler = async (m, { conn, text, args, isPrems, isOwner, usedPrefix, command }) => {
  //if (!args || !args[0] || !ytIdRegex.test(args[0])) throw 
  if (!text) throw `
  Ketik ${usedPrefix + command} link/url 
    
  Contoh
  ${usedPrefix + command} https://youtu.be/inihuruf`.trim()

  let yt = await youtubedl(text)
  let { fileSize, fileSizeH, download } = yt.audio['128kbps']
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < fileSize
  conn.reply(m.chat, `
${isLimit ? `
*Source:* ${text}
*Ukuran File:* ${fileSizeH}
_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ ${download()}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
    key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
      "imageMessage": {
        "mimetype": "image/jpeg", "caption": `
*Judul:* ${yt.title}
*Ukuran File:* ${fileSizeH}`.trim(),
        "jpegThumbnail": await (await fetch(yt.thumbnail)).buffer()
      }
    }
  })
  // m.reply((await download()).toString())
  if (!isLimit) {
    conn.sendFile(m.chat, await download(), yt.title + '.mp3', '', m, null, {
      asDocument: true
    })
    conn.sendFile(m.chat, await download(), yt.title + '.mp3', '', m, null, {
      asDocument: false
    })
  }
}

handler.help = ['mp3', 'a'].map(v => 'yt' + v + ` <link>`)
handler.tags = ['downloader']
handler.command = /^yt(a|mp3)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler
////////////
const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`;    
   
        if (!text) throw 'masukan link youtube';   
        m.reply(wait);      
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzElainaMD`);        
        const res = response.data.result;      
        var { mp3, id, title, source, duration, thumb } = res;
        let caption = `
╭──── 〔 Y O U T U B E 〕 ─⬣
 ⬡ *Title:* ${title}
 ⬡ *Id:* ${id}
 ⬡ *Duration:* ${duration} 
 ⬡ *Link:* ${source}
 ⬡ *Rating:* unknown
╰────────⬣`
    // Mengirim gambar dengan caption
    await conn.sendMessage(m.chat, { 
        image: { url: thumb }, 
        caption: caption
    }, { quoted: m });
    
        // await conn.sendFile(m.chat, mp3, null, m);
        await conn.sendMessage(m.chat, { 
            document: { url: mp3 }, 
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m });
};
handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;
*/