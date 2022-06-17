const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const FormData = require('form-data')
// const { MessageType } = require('@adiwajshing/baileys')
const { createExif, modStick } = require("../lib/exif")

let handler = async (m, { conn, args, isPrems, usedPrefix, command }) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw `_Kirim/reply gambar/stiker dengan caption/teks_\n\nContoh:\n${usedPrefix + command + (isPrems ? ' packname|author (Premium)' : '')}`
        if (/image/.test(mime)) {
            let img = await q.download()
            stiker = await toSticker(img)
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 10) return m.reply('Maksimal 10 detik!')
            let img = await q.download()
            stiker = await toSticker(img)
        }
    } finally {
        if (stiker) {
            let anu = args.join(' ').split('|')
            let satu, dua
            if (isPrems) {
                let sender = global.db.data.users[m.sender]
                satu = anu[0] !== '' ? anu[0] : global.packname
                dua = typeof anu[1] !== 'undefined' ? anu[1] : sender.name
                createExif(satu, dua)
                modStick(stiker, conn, m, m.chat)
            } else {
                satu = global.packname
                dua = global.author
                createExif(satu, dua)
                modStick(stiker, conn, m, m.chat)
            }
            // conn.sendMessage(m.chat, stiker, MessageType.sticker, { quoted: m })
        }
    }
}
handler.help = ['stiker (caption|reply media)']
handler.tags = ['sticker']
handler.command = /^(s(tic?ker)?(gif)?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

async function canvas(code, type = 'png', quality = 0.92) {
    let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
        type,
        quality
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': code.length
        },
        body: code
    })
    let image = await res.buffer()
    return image
}

function queryURL(queries) {
    return Object.entries(queries).map(([key, value]) => key + (value ? '=' + encodeURIComponent(value) : '')).join('&')
}

let { fromBuffer } = require('file-type')
async function sticker(img, url) {
    url = url ? url : await uploadImage(img)
    let {
        mime
    } = url ? { mime: 'image/jpeg' } : await fromBuffer(img)
    let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
    return await canvas(sc, 'webp')
}

function uploadImage(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                ext
            } = await fromBuffer(buffer)
            let form = new FormData()
            form.append('file', buffer, 'tmp.' + ext)
            let res = await fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
            let img = await res.json()
            if (img.error) reject(img.error)
            else resolve('https://telegra.ph' + img[0].src)
        } catch (e) {
            reject(e)
        }
    })
}

function toSticker(buffer, ext) {
    let tmp = path.join(__dirname, '../tmp/' + (new Date * 1) + '.' + ext)
    let out = tmp.replace(new RegExp(ext + '$'), 'webp')
    return new Promise((resolve, reject) => {
        fs.writeFileSync(tmp, buffer)
        spawn('ffmpeg', [
            '-y',
            '-i', tmp,
            `-vcodec`, `libwebp`,
            `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            '-f', 'webp',
            out])
            .on('error', reject)
            .on('error', () => fs.unlinkSync(tmp))
            .on('exit', () => {
                resolve(out)
                fs.unlinkSync(tmp)
                // fs.readFileSync(out)
                // if (fs.existsSync(out)) fs.unlinkSync(out)
            })
    })

}