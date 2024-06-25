/*
let fetch = require('node-fetch')
let fs = require('fs')
let playlist = JSON.parse(fs.readFileSync('lib/playlist.json'))
let timeout = 60000
let poin = 600
let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
        let id = m.chat
        if (id in conn.tebaklagu) {
            if (conn.tebaklagu[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklagu[id][0])
            delete conn.tebaklagu[id]
            throw false
        }
        conn.tebaklagu[id] = []
        //     let src = JSON.parse(fs.readFileSync(`./src/scrap/unsurkimia.json`))
        // let json = src[Math.floor(Math.random() * src.length)]

        let json = scrapGame(global.API('xteam', '/game/tebaklagu/', { id: (playlist.id || playlist.default) }, 'APIKEY'), 'tebaklagu')
        let judul = json.judul.split(' (')[0].split(' -')[0]
        let caption = `
Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP

*Reply pesan ini untuk menjawab!*
Jangan audio nya!!!!!
Bantuan mengurangi 1 limit
${usedPrefix}hintlagu`.trim()
        conn.tebaklagu[id] = [
            await conn.reply(m.chat, caption, m),
            judul, poin,
            setTimeout(() => {
                if (conn.tebaklagu[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${judul}*`, conn.tebaklagu[id][0])
                delete conn.tebaklagu[id]
            }, timeout)
        ]
        await conn.sendFile(m.chat, json.preview, 'tebaklagu.mp3', caption, m, true, { mimetype: 'audio/mp4' })
    } catch (e) {
        throw e
    }
}
handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = /^tebaklagu$/i
handler.group = true
handler.limit = false
handler.disabled = true
module.exports = handler 

async function scrapGame(api, path) {
    let json
    do {
        let res = await fetch(api)
        if (!res.ok) throw false
        let json = await res.json()
        const scrap = JSON.parse(fs.readFileSync(`./scrape/${path}.json`))
        scrap.push(json)
        fs.writeFileSync(`./scrape/${path}.json`, JSON.stringify(scrap))
    } while (/audio tidak/i.test(json.judul))
    return json
}
    */

let fetch = require('node-fetch')
let timeout = 120000
let poin = 600
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'tebaklagu-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.game[id][0])
    let ress = await fetch('https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json')
        let data = await ress.json()
        let json = data[Math.floor(Math.random() * data.length)]
    let caption = `
Artist: ${json.artis}

🕑Timeout ${(timeout / 1000).toFixed(2)} detik

💥Bonus: *${poin} XP*
Ketik *${usedPrefix}hlagu* untuk bantuan
`.trim()
    conn.game[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
    await conn.sendFile(m.chat, json.lagu, 'tebaklagu.mp3', '', conn.game[id][0])
}
handler.help = ['tebaklagu']
handler.tags = ['game']
handler.command = /^tebaklagu$/i

handler.limit = true
handler.game = true

module.exports = handler