const limit = 30
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