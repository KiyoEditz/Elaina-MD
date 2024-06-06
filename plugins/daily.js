const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia
} = require('@adiwajshing/baileys');
const moment = require("moment-timezone");
const fetch = require("node-fetch");
let free = 500
const prem = 20000
let levelling = require('../lib/levelling')
let fs = require('fs')
let data = JSON.parse(fs.readFileSync('src/code_redeem.json'))
let obj_ = data.group.trial
let objhalf = data.group.half
let obj = data.group.one
let obj2 = data.group.two

let handler = async (m, { conn, usedPrefix
  , isPrems, isMods, text, command }) => {
  let users = global.db.data.users[m.sender]
  let { level, exp } = users
  let levelpast = levelling.findLevel(exp)
  let xp = (isPrems ? prem : free) * level / 100 + free
  let xpAfter = (isPrems ? prem : free) * levelpast / 100 + free
  let time = users.lastclaim + ((isPrems || isMods) ? 86400000 : 43200000)
  let timecode = (users.lastclaim_code) + 86400000
  let code = newCode('trial')
  while (data.used.includes(code)) {
    code = newCode()
  }
  let kode = /kode/i.test(text)
  if (new Date - users.lastclaim < ((isPrems || isMods) ? 86400000 : 43200000) && !kode) throw `Kamu sudah mengklaim klaim harian hari ini\ntunggu selama ${conn.msToDate(time - new Date())} lagi`
  if (!users.autolevelup && !/now/i.test(command) && !kode && levelling.canLevelUp(users.level, users.exp, global.multiplier)) return conn.reply(m.chat, `_Kamu memiliki XP yang cukup untuk menaikan level_ *${level + ' - ' + levelpast}*\n\nNaikann level! kamu akan dapat lebih banyak XP setiap claim harian (ketik ${usedPrefix}levelup\n\nClaim sekarang : ${xp}\nClaim setelah naik level : ${xpAfter}\natau claim biasa (ketik ${usedPrefix}claimnow)`, m)
  if (isPrems) users.limit += 10
  if (text && kode) {
    if (m.isGroup) throw `_Hanya bisa klaim kode di chat Pribadi_`
    if (new Date - users.lastclaim_code < (86400000 * 2)) throw `_Kamu sudah mengklaim klaim kode reedem group gratis_\ntunggu selama ${conn.msToDate(timecode - new Date())} lagi\n\nKamu dapat klaim kode group gratis dalam 2 hari sekali`
    //await m.reply(`*Jenis:* ${text}\n\n_Cara menggunakan:_\nSalin kode di bawah ini\nTempelkan di group yang ingin kamu aktifkan bot nya\n\n*Note : pastikan Bot sudah ditambahkan ke group kamu*\n\nJika kamu ingin mendapatkan kode aktivasi dengan masa aktif lebih banyak, silahkan ketik _*.premium*_ atau hubungi .owner`,)
    //await m.reply(`${usedPrefix}use ${code}`)
    await m.reply(`Fitur di nonaktifkan karena spam\nSilahkan chat owner untuk aktivasi manual`)
    
    users.lastclaim_code = new Date * 1 + 86400000
  } else {
    users.exp += xp
    m.reply(`+${xp} XP ${isPrems ? '\n+10 Limit' : ''}`)
    users.lastclaim = new Date * 1

  }
  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: caption.trim()
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: footer
          }),
          header: proto.Message.InteractiveMessage.Header.create({
  ...(await prepareWAMessageMedia({
    image: {
      url: 'URL_VIDEO.MP4' //buat thumb video
    }
  }, {
    upload: conn.waUploadToServer
  })),
  title: text,
  gifPlayback: true,
  subtitle: namebot, //ganti aja
  hasMediaAttachment: false
}),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
                 "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"OWNER\",\"id\":\".owner\"}"
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"PREMIUM\",\"id\":\".premium\"}"
              }
            ],
          }),
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '0@newsletter',
              newsletterName: name,
              serverMessageId: 143
            }
          }
        })
      }
    },
  }, {});

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });
};
handler.help = ['claim', 'daily']
handler.tags = ['xp']
handler.command = /^(daily|claim)(now)?$/i

module.exports = handler

function newCode(text) {
  let code
  switch (text) {
    case 'trial':
      code = obj_[Math.floor(Math.random() * 1000)]
      break;
    case 'half':
      code = objhalf[Math.floor(Math.random() * 1000)]
      break;
    case 'one':
      code = obj[Math.floor(Math.random() * 1000)]
      break;
    case 'two':
      code = obj2[Math.floor(Math.random() * 1000)]
      break;
    default:
      code = false
  }
  return code
}