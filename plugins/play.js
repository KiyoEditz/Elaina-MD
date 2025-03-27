/*
const limit = 3
const ytdl = require('ytdl-core');
const yts = require('yt-search')
const fetch = require('node-fetch')
const { yta, ytv } = require('../lib/y2mate')
const { youtubedl } = require('@bochilteam/scraper')
let confirmation = {}
let confirmation2 = {} //rencana mau bikin audio/video


let handler = async (m, { conn, command, isPrems, text, usedPrefix }) => {
  let txt = text ? text : m.quoted ? m.quoted.text : 0
  if (!txt) throw `Reply pesan atau Ketik judul\n\nContoh:\n${usedPrefix + command} its only me -nomor (optional)`
  let [judul, number] = txt.split`-`
  let search = await yts(judul)
  let isVideo = /2|vid(e|i)o$/.test(command)
  let pilih = search.all.filter((v, i) => i < 5)
  let jutim = pilih.map((v, i) => `
*${i + 1}.* ${v.title}
    *Durasi:* ${v.timestamp}
`.trim()).join('\n')
  let str = `
*Silahkan ketikkan angka [1-5]*

${jutim}
`.trim()
  confirmation[m.sender] = {
    command,
    search,
    pilih,
    jutim,
    isPrems,
    isVideo,
  }
  m.reply(str)
  if (number && !isNaN(number)) {
    let msg = await conn.preSudo(number, m.sender, m)
    conn.ev.emit('messages.upsert', msg)
  }
}

handler.all = async function (m) {
  if (/^[1-5]$/i.test(m.text)) {
    //if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/mendownload/i.test(m.quoted.text)) return !0
    if (!(m.sender in confirmation)) return
    let { pilih, isVideo, isPrems, command } = confirmation[m.sender]
    let t = parseInt(m.text)
    await m.reply(`_Nomor ${t} telah dipilih_`)
    let yt = false
    let temu = pilih.find((v, i) => i == (t - 1))

    yt = await youtubedl(temu.url)
    let type
    if (!isVideo) {
      type = yt.audio['128kbps']
    } else type = yt.video['360p']
    let { fileSize, fileSizeH, download } = type
    let { title, thumbnail } = yt



    let isLimit = (isPrems ? 99 : limit) * 1024 < fileSize
    this.reply(m.chat, `
*Source:* ${temu.url}
${isLimit ? `_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ ${await download()}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
      key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
        "imageMessage": {
          "mimetype": "image/jpeg", "caption": `
*Judul:* ${title}
*Ukuran File:* ${fileSizeH}`.trim(),
          "jpegThumbnail": await (await fetch(thumbnail)).buffer()
        }
      }
    })
    let _thumb = {}
    try { if (isVideo) _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
    catch (e) { }

    if (!isLimit) {
      // no document
      this.sendFile(m.chat, await download(), title + '.mp' + (3 + /2$/.test(command)), `
*Judul:* ${title}
*Ukuran:* ${fileSizeH}
*Source:* ${temu.url}
`.trim(), m, false, {
        ..._thumb,
        asDocument: false
      })
      if (!isVideo) {
        // document
        this.sendFile(m.chat, await download(), title + '.mp' + (3 + /2$/.test(command)), `
*Judul:* ${title}
*Ukuran:* ${fileSizeH}
*Source:* ${temu.url}
`.trim(), m, false, {
          asDocument: true
        })
      }

    }
    if (!isPrems) m.limit = true
    delete confirmation[m.sender]
    return !0
  }
}

handler.help = ['lagu', 'video', 'play', 'play2'].map(v => v + ' <judul> -nomor')
handler.tags = ['media']
handler.command = /^(play2?|lagu|vid(e|i)o)$/i

module.exports = handler
  */
/** !! BACKUP CODE!! **/

let ytdl = require('ytdl-core');
let fs = require('fs');
let ffmpeg = require('fluent-ffmpeg');
let search = require ('yt-search');
const path = require('path');
const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("./lib/coklat.json")));




let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*example*: ${usedPrefix}${command} Metaphorposis Slowed`);
    conn.sendMessage(m.chat, {
      react: {
        text: '🕒',
        key: m.key,
      }
    });
  try {
    let results = await search(text);
    let videoId = results.videos[0].videoId;
    let info = await ytdl.getInfo(videoId, { agent });
    let title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    let url = info.videoDetails.video_url;
    let duration = parseInt(info.videoDetails.lengthSeconds);
    let uploadDate = new Date(info.videoDetails.publishDate).toLocaleDateString();
    let views = info.videoDetails.viewCount;
    let minutes = Math.floor(duration / 60);
    let description = results.videos[0].description;
    let seconds = duration % 60;
    let durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;       
    let audio = ytdl(videoId, { quality: 'highestaudio' });
    let inputFilePath = 'tmp/' + title + '.webm';
    let outputFilePath = 'tmp/' + title + '.mp3';
    let viewsFormatted = formatViews(views);
    let infoText = `╭─ •  *P L A Y*\n│ ◦ *Title*: ${title}\n│ ◦ *Duration*: ${durationText}\n│ ◦ *Upload*: ${uploadDate}\n│ ◦ *Views*: ${viewsFormatted}\n│ ◦ *ID*: ${videoId}\n╰──── •\n${set.footer}
  `;
    const pesan = await conn.relayMessage(m.chat, {
                extendedTextMessage:{
                text: infoText, 
                contextInfo: {
                     externalAdReply: {
                        title: `P L A Y`,
                        body: `${description}`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: url
                    }
                }, mentions: [m.sender]
}}, {});

    audio.pipe(fs.createWriteStream(inputFilePath)).on('finish', async () => {
      ffmpeg(inputFilePath)
        .toFormat('mp3')
        .on('end', async () => {
          let thumbnailData = await conn.getFile(thumbnailUrl);
          let buffer = fs.readFileSync(outputFilePath);
          let fileName = title + '.mp3';
          //let outputFileName = path.basename(inputFilePath, '.webm') + '.mp3';
          //let readStream = fs.createReadStream(path.join('tmp', outputFileName));
          //conn.sendFile(m.chat, buffer, outputFileName, null, m, { asDocument: true });
          await conn.sendFile(m.chat, buffer, `${title}.mp3`, '', m);
          await conn.sendFile(m.chat, buffer, fileName, '', m, null, { asDocument: true });
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .on('error', (err) => {
          console.log(err);
          m.reply(`There was an error converting the audio: ${err.message}`);
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        })
        .save(outputFilePath);
    });
  } catch (e) {
    console.log(e);
    m.reply(`An error occurred while searching for the song: ${e.message}`);
  }
};

handler.command = handler.help = ['play', 'song'];
handler.tags = ['downloader'];
handler.premium = false;
handler.limit = false;

module.exports = handler

function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  } else {
    return views.toString();
  }
}