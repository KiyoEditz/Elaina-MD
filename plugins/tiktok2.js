/*
const { tiktokdl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  let link = /https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com\/./i
  if (!(link.test(args[0]) && args[0])) throw `Contoh\n\nKetik ${usedPrefix}tiktok https://vm.tiktok/blbala`
  let tt = await tiktokdl(args[0])
    .catch(e => { throw `Error tidak diketahui` })
  let { nickname, avatar, unique_id } = tt.author
  let vid = tt.video.no_watermark

  let mp3 = /musi[ck]/i.test(command)
  if (!mp3) {
    if (!isPrems) m.limit = true
    await m.reply('_Sedang proses mengirim..._')
  }
  await conn.sendFile(m.chat, vid, (new Date * 1) + (mp3 ? '.mp3' : '.mp4'), (mp3 ? '' : `@${unique_id}\n${nickname}`), m, null, { asDocument: global.db.data.users[m.sender].useDocument, mimetype: (mp3 ? 'audio/mpeg' : null) })
  if (!mp3) {
    conn.reply(m.chat, 'Mau ambil lagu nya?\nKetik .tomp3 ', m)
  }
}
handler.help = ['tiktok', 'tiktokmusic'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(t(ik)?t(ok)?2?)(musi[ck])?$/i

module.exports = handler
*/
const { tiktok } = require('api-dylux');
let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan URL!\n\nContoh: ${usedPrefix + command} https://tiktok.com/xxx`
try {
conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}  
	})
  let thumb = 'https://telegra.ph/file/72883ee07496d215ae797.jpg'
  let json = await tiktok(text)
var hasil = `${layout.xl} T I K T O K  W M
◦ Username: ${json.nickname}  
◦ NicknameID: ${json.unique_id}
◦ Description: ${json.description}
◦ Duration: ${json.duration}
`
conn.sendMessage(m.chat, {
		react: {
			text: '✅',
			key: m.key,
		}
	})
await conn.sendFile(m.chat, json.wmplay, '', hasil, m)
  } catch (error) {
    console.log(error);
    throw 'Tidak Dapat Mengambil Informasi Url';
  }
}

handler.command = handler.help = ['tiktokwm', 'ttwm', 'tmp4wm', 'ttmp4wm']
handler.tags = ['downloader']

module.exports = handler