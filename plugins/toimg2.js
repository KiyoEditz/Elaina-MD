/*
let uploadImage = require('../lib/uploadImage.js')
let fetch = require('node-fetch')

let handler = async (m, { conn, usedPrefix, command }) => {

let q = m.quoted ? m.quoted : m
    if (!m.quoted) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw `balas stiker gif dengan caption *${usedPrefix + command}*`
    let data = await q.download?.()
let image = await uploadImage(data)
    let out = await fetch(API('alya', '/api/webp-convert', {
        url: image,
        action: 'webp-to-png'
    }, 'apikey'))
    res = await out.json()
    conn.sendFile(m.chat, res.data.url, '', 'DONE', m)
}
handler.help = ['toimg (reply stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i
module.exports = handler
*/
const { readFileSync: read, unlinkSync: remove } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        if (!m.quoted) throw `Balas stiker dengan caption *${usedPrefix + command}*`
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) throw `Balas stiker gif dengan caption *${usedPrefix + command}*`
        
        // Mendapatkan path sementara untuk file hasil konversi
        let file = path.join(tmpdir(), `${Date.now()}.png`)
        let media = await conn.downloadAndSaveMediaMessage(q, path.join(tmpdir(), `${Date.now()}.webp`))
        
        // Eksekusi konversi dari webp ke png menggunakan ffmpeg
        exec(`ffmpeg -i ${media} ${file}`, (err, stderr, stdout) => {
            // Hapus file sumber setelah konversi selesai
            remove(media)
            
            if (err) {
                conn.reply(m.chat, `🚩 Konversi gagal.`, m)
                return
            }
            
            // Baca file hasil konversi dan kirim sebagai gambar
            const buffer = read(file)
            conn.sendFile(m.chat, buffer, '', '', m)
            remove(file)
        })
    } catch (e) {
        console.log(e)
        throw `Terjadi Kesalahan!\nCode: ${e}`
    }
}

handler.help = ['toimg (balas stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i

module.exports = handler