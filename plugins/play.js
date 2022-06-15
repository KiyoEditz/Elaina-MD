const limit = 30
const yts = require('yt-search')
const fetch = require('node-fetch')
const { newMessagesDB } = require("@adiwajshing/baileys")
const { servers, yta, ytv } = require('../lib/y2mate')
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
    conn.emit('chat-update', {
      jid: m.sender,
      hasNewMessage: true,
      messages: newMessagesDB([conn.cMod(m.chat, m, number, m.sender)])
    })
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
    let usedServer = servers[0]
    for (let i in servers) {
      let server = servers[i]
      try {
        yt = await (isVideo ? ytv : yta)(temu.url, server)
        usedServer = server
        break
      } catch (e) {
        m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
      }
    }
    if (yt === false) throw 'Semua server tidak bisa :/'
    let { dl_link, thumb, title, filesize, filesizeF } = yt
    let isLimit = (isPrems ? 99 : limit) * 1024 < filesize
    this.reply(m.chat, `
*Source:* ${temu.url}
*Server :* ${usedServer}
${isLimit ? `_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ ${dl_link}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
      key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
        "imageMessage": {
          "mimetype": "image/jpeg", "caption": `
*Judul:* ${title}
*Ukuran File:* ${filesizeF}`.trim(),
          "jpegThumbnail": await (await fetch(thumb)).buffer()
        }
      }
    })
    let _thumb = {}
    try { if (isVideo) _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
    catch (e) { }

    if (!isLimit) {
      // no document
      this.sendFile(m.chat, dl_link, title + '.mp' + (3 + /2$/.test(command)), `
*Judul:* ${title}
*Ukuran:* ${filesizeF}
*Source:* ${temu.url}
`.trim(), m, false, {
        ..._thumb,
        asDocument: false
      })
      if (!isVideo) {
        // document
        this.sendFile(m.chat, dl_link, title + '.mp' + (3 + /2$/.test(command)), `
*Judul:* ${title}
*Ukuran:* ${filesizeF}
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