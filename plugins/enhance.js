const fetch = require('node-fetch')
const FormData = require('form-data')

let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command}`
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  let body = new FormData
  body.append('image', img, 'image')
  let res = await fetch('http://max-image-resolution-enhancer.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud/model/predict', {
    method: 'POST',
    body
  })
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  await conn.sendFile(m.chat, await res.buffer(), 'hd.jpg', 'Kalau tidak HD brarti dari sononya emang burique :/', m)
}
handler.help = ['hd (caption|reply media)']
handler.tags = ['tools']
handler.command = /^(hd|enhance)$/i

module.exports = handler
