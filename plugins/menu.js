
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let desc = ''

let handler = async (m, { conn, usedPrefix: _p, args }) => {
  let fakeOption = {
    key: {
      remoteJid: 'status@broadcast',
      participant: '0@s.whatsapp.net',
      fromMe: false
    },
    message: {
      imageMessage: {
        //mimetype: "image/jpeg",
        caption: `Elaina-bot WhatsApp`,
        thumbnail: global.menu,
        mediaType: 1,
      renderLargerThumbnail: true
      }
    }
  }
  let defaultMenu = {
    before: `
╔══════════════
╟「 Hai, %ucap *${conn.user.name}* 」
╚════════════════
`.trim(),
    header: '*〘 %category 〙*\n╔══════════════',
    body: '╟ %cmd%islimit',
    footer: '╚════════════════\n',
    after: `*%week %weton, %date*\n*Waktu Server:* %time WIB`,
  }
  try {
    //let package = JSON.parse(await fs.promises.readFile(path.join(_dirname, '../package.json')).catch(_=> '{}'))
    let tags
    let type = (args[0] || '').toLowerCase()
    switch (type) {
      case 'sticker':
      case 'stiker':
        tags = {
          'sticker': 'Menu Sticker',
          'stickertext': 'Teks ke Sticker',
          'stickertomedia': 'Stiker ke Media',
          'stickerother': 'Sticker Lain',
          'stickerprems': 'Sticker Premium',
        }
        desc = 'Ini adalah fitur untuk membuat stiker kamu sendiri dari gambar/video/teks'
        break
      case 'all':
        tags = {
          "main": "Main",
        "anonymous": "Anonymous",
        "islami": "Islami",
        "game": "Game",
        "anime": "Anime",
        "tools": "Tools",
        "fun": "Fun",
        "primbon": "Primbon",
        "group": "Group",
        "info": "Info",
        "audio": "Audio",
        "maker": "Maker",
        "internet": "Internet",
        "downloader": "Downloader",
        "nsfw": "Nsfw",
        "vote": "Voting",
        "absen": "Absen",
        "premium": "Premium",
        "advanced": "Advanced",
        "owner": "Owner",
        "giveaway": "Giveaway",
        "nocategory": "No Category"
        }
        desc = `Ini adalah semua fitur bot yang ada`
        break
      case 'download':
        tags = {
          'downloader': 'Menu Download',
          'downloadersosmed': 'SosMed Download',
          'downloaderanime': 'Anime Download',
        }
        desc = `Ini adalah fitur untuk mendownload media melalui link/url
Contoh:
${_p}tiktok https://vm.tiktok.com/abcdefghi
`
        break
      case 'edukasi':
        tags = {
          'belajar': 'Menu Edukasi',
        }
        desc = `Ini adalah fitur edukasi`
        break
      case 'media':
        tags = {
          'media': 'Menu Media',
        }
        desc = `
Ini adalah fitur untuk mendownload media melalui keyword
Contoh:
${_p}play bertaut
`
case 'anime':
        tags = {
          'anime': 'Menu anime',
        }
        desc = `
Ini adalah fitur untuk mendownload anime melalui judul
Contoh:
${_p}anichin yosuga no sora
`
        break
      case 'gambar':
        tags = {
          'image': 'Menu Gambar',
          'imagerandom': 'Random',
          'photooxy': 'Menu Photooxy',
          'textpro': 'Menu TextPro',
        }
        desc = `Ini adalah fitur generator gambar`
        break
      case 'maker':
        tags = {
          'maker': 'Menu Maker',
        }
        desc = `Ini adalah fitur maker/kreasi`
        break
      case 'pencarian':
        tags = {
          'search': 'Menu Pencarian',
        }
        desc = `Ini adalah fitur untuk pencarian berdasarkan keyword`
        break
      case 'tools':
      case 'tool':
        tags = {
          'tools': 'Menu Tools',
        }
        desc = `Ini adalah fitur tools/alat`
        break
      case 'sastra':
        tags = {
          'quotes': 'Menu Sastra',
        }
        desc = `Ini adalah fitur pilihan sastra`
        break
      case 'group':
        tags = {
          'group': 'Menu Group',
          'admin': 'Admin Group'
        }
        desc = `Ini adalah fitur untuk Group Chat`
        break
      case 'fun':
        tags = {
          'fun': 'Menu Fun',
          'kerang': 'Kerang Ajaib'
        }
        desc = `Ini adalah fitur fun/senang-senang`
        break
      case 'game':
        tags = {
          'game': 'Menu Game',
        }
        desc = `Ini adalah beberapa fitur game`
        break
      case 'ai':
        tags = {
        'ai': 'Menu AI',
          }
        desc = `Ini adalah menu AI`
        break
       case 'rpg':
        tags = {
          'rpg': 'Menu rpg',
        }
        desc = `Ini adalah beberapa fitur rpg`
        break
      case 'premium':
        tags = {
          'premium': 'Menu Premium',
          'jadibot': 'Jadi Bot'
        }
        desc = `Ini adalah fitur khusus user Premium`
        break
      case 'info':
        tags = {
          'main': 'Start Bot',
          'xp': 'Exp & Limit',
          'info': 'Menu Info',
        }
        desc = `Ini adalah fitur Informasi Bot`
        break
      case 'anony':
        tags = {
          'anonymous': 'Chat Anonymous',
        }
        desc = `Ini adalah fitur Anonymous Chat yang memungkinkan kamu untuk chat dengan orang yg tidak kmu knal sblmnya.. mirip Telegram
Note: Fiturs ini hanya digunakan di Private Chat /Chat Pribadi
`
        break
      case 'owner':
        tags = {
          'owner': 'Menu Owner/Jadibot',
        }
        desc = `Ini adalah fitur khusus Owner/Jadibot`
        break
      case 'editor':
        tags = {
          'audio': 'Menu Audio Editor',
          'editorgambar': 'Coming soon'
        }
        break
      case 'msg':
      case 'penyimpanan':
      case 'database':
        tags = {
          'database': 'Menu Penyimpanan',
          'cmd': 'Menu Command Media'
        }
        desc = `Untuk menyimpan teks, vn, audio, video, gambar ke dalam memori Bot`
        break
      case 'kelas':
        tags = {
          'vote': 'Menu Vote',
          'absen': 'Menu Absen',
        }
        break
      default:
        type = ''
        break
    }
    let { exp, limit, level, registered, role, name: namaa } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = namaa
    let d = new Date
    let locale = 'id'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + d.getTimezoneOffset()) / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    conn.menu = conn.menu ? conn.menu : {}
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after
    let _text
    if (!type) {
      tags = {
        'menuringkas': 'Daftar Menu',
      }
      before = conn.menu.before || `
Hai, 
_%ucap *%name!*_

┏❏──「 *INFO* 」───⬣
│○ *Library:* Baileys
│○ *Function:* Assistant
┗––––––––––✦
 
┌  ◦ Uptime : %uptime
│  ◦ Hari : %week %weton
│  ◦ Waktu : %time
│  ◦ Tanggal : %date
│  ◦ Version : %version
└  ◦ Prefix Used : [ %p ]

┏❏──「 *NOTE* 」───⬣
│○ If you find a bug or want\n│ a premium upgrade, please\n│ contact the owner.\n│○ *Ⓟ* = Premium\n│○ *Ⓛ* = Limit
┗––––––––––✦
`
      _text = before
    } else {
      _text = before + '\n' + desc + '\n'
    }

    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }

    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? ' ' : '') + '\n'
      }
      _text += footer
    }
    _text += after
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      version: `5.0.0`,
      xp4levelup: max - exp,
      level, limit, name, ucap: ucap(), weton, week, date, time, totalreg, rtotalreg, role,
      readmore: conn.readmore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    //conn.reply(m.chat, text.trim(), fakeOption)
    conn.relayMessage(m.chat, {
            extendedTextMessage:{
                text: text, 
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: date,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F'
                    }
                }, 
                mentions: [m.sender]
            }
        }, {})
  } catch (e) { throw e }
}
handler.help = [
  'all',
  'stiker',
  'anony',
  'download',
  'media',
  'edukasi',
  'ai',
  'gambar',
  'maker',
  'pencarian',
  'tools',
  'sastra',
  'group',
  'kelas',
  'fun',
  'game',
  'rpg',
  'premium',
  'penyimpanan',
  'editor',
  'owner',
  'info',
].map(v => 'menu ' + v)
handler.tags = ['menuringkas']
handler.command = /^(menu)$/i
handler.exp = 3
module.exports = handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}


  /*
 //━━━━━━━━[ DEFAULT SETTINGS ]━━━━━━━━//
let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
let levelling = require('../lib/levelling')
let fs = require('fs')
const util = require('util')
const os = require('os')
let path = require('path')
let { createHash} = require('crypto')
let fetch = require('node-fetch')
let { perfomance } = require('perf_hooks')
let moment = require('moment-timezone')

//━━━━━━━━[ CATEGORY ]━━━━━━━━//
let handler = async (m, { conn, usedPrefix: _p, args, usedPrefix, command }) => {
try {
  let tags
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'main', 'downloader', 'sticker', 'xp', 'game', 'rpg', 'asupan', 'group', 'fun', 'tools', 'internet', 'info', 'islam', 'kerang', 'maker', 'stalk', 'quotes', 'shortlink', 'anonymous', 'voicechanger', 'image', 'nsfw', 'owner', 'advanced']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == 'all') tags = {
   'main': 'MENU UTAMA',
  'downloader': 'MENU DOWNLOADER',
  'sticker': 'MENU CONVERT',
  'xp': 'MENU EXP',
  'game': 'MENU GAME',
  'rpg': 'MENU RPG',
  'group': 'MENU GROUP',
  'fun': 'MENU FUN',
  'tools': 'MENU TOOLS',
  'internet': 'INTERNET',
  'info': 'MENU INFO',
  'islam' : 'MENU ISLAMI',
  'kerang': 'MENU KERANG',
  'asupan': 'MENU ASUPAN',
  'maker': 'MENU MAKER',
  'quotes' : 'MENU QUOTES',
  'stalk': 'MENU STALK',
  'shortlink': 'SHORT LINK',
  'anonymous': 'ANONYMOUS CHAT',
  'voicechanger': 'VOICE CHANGER',
  'image': 'MENU IMAGE',
  'nsfw': 'MENU NSFW',
  'owner': 'MENU OWNER',
  'advanced': 'ADVANCED',
  }
  if (teks == 'main') tags = {
    'main': 'MENU UTAMA',
  }
  if (teks == 'downloader') tags = {
  'downloader': 'MENU DOWNLOADER',
  }
  if (teks == 'sticker') tags = {
  'sticker': 'MENU CONVERT',
  }
  if (teks == 'xp') tags = {
  'xp': 'MENU EXP',
  }
   if (teks == 'asupan') tags = {
  'asupan': 'MENU ASUPAN', 
  }
  if (teks == 'game') tags = {
  'game': 'MENU GAME',
  }
  if (teks == 'rpg') tags = {
  'rpg': 'MENU RPG',
  }
  if (teks == 'group') tags = {
  'group': 'MENU GROUP',
  }
  if (teks == 'fun') tags = {
  'fun': 'MENU FUN',
  }
  if (teks == 'tools') tags = {
  'tools': 'MENU TOOLS',
  }
  if (teks == 'internet') tags = {
  'internet': 'INTERNET',
  }
  if (teks == 'info') tags = {
  'info': 'MENU INFO',
  }
  if (teks == 'islam') tags = {
  'islam': 'MENU ISLAMI',
  }
  if (teks == 'kerang') tags = {
  'kerang': 'MENU KERANG',
  }
  if (teks == 'maker') tags = {
  'maker' : 'MENU MAKER',
  }
  if (teks == 'quotes') tags = {
  'quotes': 'MENU QUOTES',
  }
  if (teks == 'stalk') tags = {
  'stalk': 'MENU STALK',
  }
  if (teks == 'shortlink') tags = {
    'shortlink': 'SHORTLINK',
  }
  if (teks == 'anonymous') tags = {
  'anonymous': 'ANONYMOUS CHAT',
  }
  if (teks == 'voicechanger') tags = {
  'voicechanger': 'VOICE CHANGER',
  }
  if (teks == 'image') tags = {
  'image': 'MENU IMAGE',
  }
  if (teks == 'nsfw') tags = {
  'nsfw' : 'MENU NSFW',
  }
  if (teks == 'owner') tags = {
  'owner': 'MENU OWNER',
  }
  if (teks == 'advanced') tags = {
  'advanced': 'MENU ADVANCED',
  }
  
  
  
  //━━━━━━━━[ DEFAULT MENU ]━━━━━━━━//
const defaultMenu = {
  before:``.trimStart(), 
  header: '*〘 %category 〙*\n╔══════════════',
  body: '╟ %cmd %islimit %isPremium',
  footer: '╚════════════════\n', 
  after: `Made With ${global.nameowner}`,
}

//━━━━━━━━[ DATABASE USER ]━━━━━━━━//
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender 
    let name = conn.getName(m.sender)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let premium = global.db.data.users[m.sender].premium
    let user = global.db.data.users[who]
    let { exp, limit, level, money, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let tag = `@${m.sender.split('@')[0]}`
 m, { contextInfo: { mentionedJid: conn.parseMention(tag) }}

//━━━━━━━━[ TIMER ]━━━━━━━━//
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let waktuwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')

//━━━━━━━━[ SETTING HELP ]━━━━━━━━//
let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
    return {
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }
  })


//━━━━━━━━[ BAGIAN MENU ]━━━━━━━━//
let skntex = `Hai ${tag} ${global.ucapan}
┏❏──「 *𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃* 」───⬣
│○ 𝐍𝐚𝐦𝐚 𝐁𝐨𝐭: *Elaina-MD*
│○ 𝐖𝐚𝐤𝐭𝐮: *${time}*
│○ 𝐓𝐚𝐧𝐠𝐠𝐚𝐥: *${week} ${weton}*
│○ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐃𝐚𝐭𝐞: *${dateIslamic}*
│○ 𝐔𝐩𝐭𝐢𝐦𝐞: *${uptime}*
│○ 𝐃𝐚𝐭𝐚𝐛𝐚𝐬??: *${rtotalreg} dari ${totalreg}*
┗––––––––––✦`
if (teks == '404') {
let sections = [
      {
        title: 'List Menu ',
        rows: [
          { "header": "", "title": 'Menu All', "highlight_label": 'Recommended', "description": "Menampilkan semua Fitur Menu", "id": `${_p + command} all`,},
          { "header": "", "title": 'Menu Main', "description": "Menampilkan Menu Main", "id": `${_p + command} main` },
          { "header": "", "title": 'Menu Download', "description": "Seluruh Fitur Download", "id": `.menu downloader` },
          { "header": "", "title": 'Menu Sticker', "description": "Memberikan Fitur Sticker", "id": `${_p + command} sticker` },
          { "header": "", "title": 'XP', "description": "Klaim XP", "id": `${_p + command} xp` },
	  { "header": "", "title": 'Menu Game', "description": "Seluruh Fitur Game", "id": `${_p + command} game` },
	{ "header": "", "title": 'Menu Rpg', "description": "Seluruh Fitur Game Rpg", "id": `${_p + command} rpg` },
          { "header": "", "title": 'Menu Grup', "description": "Seluruh Fitur Group", "id": `${_p + command} group` },
          { "header": "", "title": 'Menu Fun', "description": "Menyediakan Menu Fun", "id": `${_p + command} fun` },
          { "header": "", "title": 'Menu Tools', "description": "Memberikan Fitur Tools", "id": `${_p + command} tools` },
          { "header": "", "title": 'Menu Internet', "description": "Memberikan Fitur Internet", "id": `${_p + command} internet` },
          { "header": "", "title": 'Menu Info/AI', "description": "Menyediakan Info/AI", "id": `${_p + command} info` },
          { "header": "", "title": 'Menu Islam', "description": "Menu Islam🌜", "id": `${_p + command} islam` },
          { "header": "", "title": 'Menu Kerang', "description": "Menu Kerang", "id": `${_p + command} kerang`},
          { "header": "", "title": 'Menu Maker', "description": "Memberikan Menu Textpro Maker", "id": `${_p +command} maker` },
          { "header": "", "title": 'Menu Anime', "description": "Menampilkan menu Anime", "id": `${_p + command} image` },
          { "header": "", "title": 'Menu Owner', "description": "Khusus Untuk Owner Bot", "id": `${_p + command} owner` },
          { "header": "", "title": 'Menu Quotes', "description": "Kumpulan Quotes Disini", "id": `${_p + command} quotes` },
          { "header": "", "title": 'Menu Stalking', "description": "Melampirkan Menu Stalking", "id": `${_p + command} stalk` },
          { "header": "", "title": 'Menu NSFW 🅟', "description": "KHUSUS PREMIUM", "id": `${_p + command} nsfw` },
        ]       
      }, {
      'title': 'INFO BOT ',
        rows: [
          { "header": "", "title": 'Creator', "description": "Nomer pengembang BOT", "id": `${_p}owner` },
          { "header": "", "title": 'Speed', "description": "menampilkan kecepatan respon BOT", "id": `${_p}ping` },
        ]
      }
    ]
    const fcon = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': `${name}`,}}}
     let media = await prepareWAMessageMedia({ image: { url: './thumbnail.jpg' } }, { upload: conn.waUploadToServer });
    let msg = {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2,
				},
				interactiveMessage: {
					body: {
						text: skntex,
					},
					footer: {
						text: wm,
					},
					header: proto.Message.InteractiveMessage.Header.create({
          ...media,
          title: "",
          subtitle: "",
          hasMediaAttachment: false
        }),
					nativeFlowMessage: {
						buttons: [
							{
              "name": "single_select",
              "buttonParamsJson":
JSON.stringify({
 "title": "List Menu ⎙",
"sections": sections
              })              
            },
            {
              "name": "cta_url",
              "buttonParamsJson": JSON.stringify({
                display_text: "Saluran Update Bot",
                url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O',
                merchant_url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O'
              })
            },
          ],
					},
					contextInfo: {
						quotedMessage: m.message,
						participant: m.sender,
						...m.key
					}
				},
			},
		},
	};
    return conn.relayMessage(m.chat, msg, fcon, { });
}
  
  
 
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
        before,
        ...Object.keys(tags).map(tag => {
          return header.replace(/%category/g, tags[tag]) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
              return menu.help.map(help => {
                return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                  .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                  .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                  .trim()
              }).join('\n')
            }),
            footer
          ].join('\n')
        }),
        after
      ].join('\n')
      text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      name,
      ucap: ucapan(),
      level, limit, money, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    
//━━━━━━━━[ SETTINGS MENU ]━━━━━━━━//
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    let vn = 'https://file.betabotz.eu.org/file/wv9pkwd9mcb0ytx1k8if.aac'
    
  await conn.sendMessage(m.chat, {
      video: { url: 'https://btch.pages.dev/file/8af3d30240c29c2ddc024.mp4' },
      gifPlayback: true,
      caption: text,
      contextInfo: {
      externalAdReply: {
      title: namebot3,
      body: nameowner,
      thumbnailUrl: './src/elaina.png',
      sourceUrl: ``,
      mediaType: 1,
      renderLargerThumbnail: true
      }
      }}, {
                        quoted: m
                    })
                    conn.sendFile(m.chat, vn, null, null, m, true, { ptt: true })
} catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.register = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

//━━━━━━━━[  JANGAN DI UBAH  ]━━━━━━━━//
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "Selamat DiniHari"
  if (time >= 4) {
    res = "Selamat Pagi"
  }
  if (time > 10) {
    res = "Selamat Siang"
  }
  if (time >= 15) {
    res = "Selamat Sore"
  }
  if (time >= 18) {
    res = "Selamat Malam"
  }
  return res
}
  */