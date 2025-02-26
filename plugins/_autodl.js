//const { igdl, twitter, pin } = require('../lib/scrape')
const { ytIdRegex, servers, yta, ytv } = require('../lib/y2mate')
const fetch = require('node-fetch')
const fg = require('api-dylux'); 
const { tiktokdl } = require('tiktokdl');
const {youtubedl, savefrom, instagramdl } = require('@bochilteam/scraper')
let eror = `Link salah`
let acc = `Link accept`
const can_drop = 'Kamu bisa download link ini langsung tanpa harus menulis perintah!\nCukup langsung kirim link ke chat ini'
let handler = m => m

handler.before = async function (m, { isPrems, match }) {
    let chat = db.data.chats[m.chat]
    let user = db.data.users[m.sender]
    let set = db.data.settings[this.user.jid]
    if (chat.isBanned || user.banned || m.isBaileys) return
    conn.autodl = conn.autodl ? conn.autodl : {}
    if (m.sender in conn.autodl) {
        delete conn.autodl[m.sender]
        return
    }

    if (/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com/i.test(m.text)) {
        if (/..?(t(ik)?t(ok)?2?) /i.test(m.text)) {
            return m.reply(can_drop)
        }
        let link = (/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com\/.*/i.exec(m.text))[0].split(/\n| /i)[0]

       m.reply(acc)
        let tt = await tiktokdl(link)
        const { video, music } = tt;
        //let res = await tt.json()
        //if (!res.status) throw `Error`
      //  let { title, music_info, author, data } = res
      //  let vid = data.find(v => v.type == 'nowatermark').url

        //await conn.sendFile(m.chat, video, (new Date * 1) + '.mp4', `*TIKTOK DINWLODER*`, m, null, { asDocument: global.db.data.users[m.sender].useDocument })
        await conn.sendFile(m.chat, video, (new Date * 1) + '.mp4', '*TikTok Video Downloader*', m, null, { asDocument: global.db.data.users[m.sender].useDocument});
    await conn.sendFile(m.chat, music,  (new Date * 1) + '.mp3', '*TikTok Music Downloader*', m, null, { asDocument: global.db.data.users[m.sender].useDocument});
        return true
    }

     //if (/https?:\/\/(fb\.watch|(www\.|web\.|m\.)?facebook\.com)/i.test(m.text)) {
     	//let fb = (/https?:\/\/(fb\.watch|(www\.|web\.|m\.)?facebook\.com)/i.exec(m.text))[0].split(/\n| /i)[0]
        // let res = await fg.fbdl(fb)
       //  if (!res.ok) return m.reply(eror)
        // let json = await res.json()
        // if (!json.status) return m.reply(this.format(json))
       // const { videoUrl, size, title } = res;
       // let vid = videoUrl;
        // await m.reply(wait)
       // await conn.sendFile(m.chat, vid, '', `Title: ${title}\nUkuran: ${size}\n\n© stikerin`, m)
   //  }

    if (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)/i.test(m.text)) {
        if (/..?(ig|instagram)2? /i.test(m.text)) {
            return m.reply(can_drop)
        }
        let link = (/https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.*/i.exec(m.text))[0].split(/\n| /i)[0]
        m.reply(acc)
        let ig = await fetch(global.API('alya', 'api/ig', { url: link }, 'apikey'))
        let res = await ig.json()
        let vid = res.data

        await m.reply('_Sedang proses mengirim..._')

        for (let { type, url } of vid) {
            await conn.sendFile(m.chat, url, 'ig.' + (type == 'image') ? 'jpg' : 'mp4')
                , '', m, null, { asDocument: global.db.data.users[m.sender].useDocument }
        }
        return
    }


    // if (/https?:\/\/(www\.)?twitter\.com\/.*\/status/i.test(m.text)) {
    //     twitter(m.text.match(/https?:\/\/(www\.)?twitter\.com\/.*\/status\/.*/i)[0].split(/\n| /i)[0]).then(async res => {
    //         let json = JSON.parse(JSON.stringify(res))
    //         let pesan = json.data.map((v) => `Link: ${v.url}`).join('\n------------\n')
    //         await m.reply(wait)
    //         for (let { url } of json.data) {
    //             this.sendFile(m.chat, url, 'tw' + (/mp4/i.test(url) ? '.mp4' : '.jpg'), '© stikerin', m)
    //         }
    //     }).catch(_ => _) 
    // }

    if (ytIdRegex.test(m.text)) {
        if (/..?youtu/i.test(m.text)) {
            return m.reply(can_drop)
        }

        let yt = await youtubedl(m.text)
        let audio = yt.audio['128kbps']
        let video = yt.video['360p']
        let { fileSize, fileSizeH } = video
        let audiodl = await audio.download()
        let videodl = await video.download()

        let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < fileSize
        conn.reply(m.chat, `
      ${isLimit ? `
      *Source:* ${m.text}
      *Ukuran File:* ${fileSizeH}
      _File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ \nVideo : ${videodl.toString()}\n\nAudio : ${audiodl.toString()}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
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
            conn.sendFile(m.chat, audiodl, yt.title + '.mp3', '', m, null, {
                asDocument: true
            })
            conn.sendFile(m.chat, videodl, yt.title + '.mp4', '', m, null, {
                asDocument: true
            })
        }
    }
    delete conn.autodl[m.sender]
    return !0
}

module.exports = handler