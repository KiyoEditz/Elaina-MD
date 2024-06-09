
let levelling = require('../lib/levelling')
let fs = require('fs')
let path = require('path')
let util = require('util')
let moment = require('moment-timezone')
const defaultMenu = {
  before: ``.trimStart(),
  //header: '〘 %category 〙\n╔══════════════',
    //body: '╟ %cmd%islimit',
    //footer: '╚════════════════\n',
    header: '⃝▣──「 %category 」───⬣',
  body: '│○ %cmd%islimit%isPremium',
  footer: '▣───────────⬣\n',
  after: set.footer,
}
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {
  let tags
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'anonymous', 'downloader', 'islami', 'fun', 'game', 'group', 'info', 'internet', 'maker', 'owner', 'rpg', 'sticker', 'tools', 'ai', 'voice', 'primbon', 'stalk', 'nsfw']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == "all") tags = {
        "main": "Main",
        "anonymous": "Anonymous",
        "islami": "Islami",
        "game": "Game",
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

  if (teks == 'anonymous') tags = {
    anonymous: 'ANONYMOUS'
  }
  if (teks == 'downloader') tags = {
    downloader: 'DOWNLOADER'
  }
  if (teks == 'islami') tags = {
    islami: 'ISLAMI'
  }
  if (teks == 'fun') tags = {
    fun: 'FUN'
  }
  if (teks == 'game') tags = {
    game: 'GAME'
  }
  if (teks == 'group') tags = {
    group: 'GROUP'
  }
  if (teks == 'info') tags = {
    info: 'INFO'
  }
  if (teks == 'internet') tags = {
    internet: 'INTERNET'
  }
  if (teks == 'maker') tags = {
    maker: 'MAKER'
  }
  if (teks == 'owner') tags = {
    owner: 'OWNER'
  }
  if (teks == 'rpg') tags = {
    rpg: 'RPG'
  }
  if (teks == 'sticker') tags = {
    sticker: 'STICKER'
  }
  if (teks == 'tools') tags = {
    tools: 'TOOLS'
  }
  if (teks == 'ai') tags = {
    ai: 'AI'
  }
  if (teks == 'info') tags = {
    info: 'INFO'
  }
if (teks == 'primbon') tags = {
    primbon: 'PRIMBON'
  }
if (teks == 'stalk') tags = {
    stalk: 'STALK'
  }
if (teks == 'nsfw') tags = {
    nsfw: 'NSFW'
  }
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(_dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
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
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    if (teks == '404') {
      let owner = `${own.no}@s.whatsapp.net`
      let radit = `@${owner.split("@")[0]}`
      let capt = `${ucapan()} @${m.sender.replace(/@.+/g, '')}\n`
      capt += `I am an automatic system (WhatsApp Bot), which can help you to complete small jobs such as downloading videos or images etc. just via WhatsApp.\n\n`
      capt += `┏❏──「 *INFO* 」───⬣\n│☂  *User* : ${rtotalreg} of ${totalreg}\n`
      capt += `│☂  *Instagram* : ${sosial.ig}\n`
      capt += `│☂  *Creator* : Kiyo•Editz™\n┗––––––––––✦\n\n //use ${radit} to tag `
      capt += `If you find a bug or want a premium upgrade, please contact the owner.\n\n *Ⓟ* = Premium\n *Ⓛ* = Limit\n\n`
      capt += `┌  ○  ${_p + command} all\n`
      capt += `│  ○  ${_p + command} anonymous\n`
      capt += `│  ○  ${_p + command} downloader\n`
      capt += `│  ○  ${_p + command} islami\n`
      capt += `│  ○  ${_p + command} fun\n`
      capt += `│  ○  ${_p + command} game\n`
      capt += `│  ○  ${_p + command} group\n`
      capt += `│  ○  ${_p + command} info\n`
      capt += `│  ○  ${_p + command} internet\n`
      capt += `│  ○  ${_p + command} maker\n`
      capt += `│  ○  ${_p + command} owner\n`
      capt += `│  ○  ${_p + command} nsfw\n`
      capt += `│  ○  ${_p + command} rpg\n`
      capt += `│  ○  ${_p + command} sticker\n`
      capt += `│  ○  ${_p + command} tools\n`
      capt += `│  ○  ${_p + command} info\n`
      capt += `│  ○  ${_p + command} ai\n`
      capt += `│  ○  ${_p + command} primbon\n`
      capt += `└  ○  ${_p + command} stalk\n\n`
      capt += set.footer
       conn.sendMessage(m.chat, {
text: capt.trim(),
contextInfo: {
mentionedJid: [m.sender, owner],
externalAdReply: {
title: set.bot,
body: set.wm,
thumbnailUrl: media.thumbnail,
sourceUrl: sosial.gc,
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: m})
return conn.sendFile(m.chat, './src/menu.opus', 'tes.mp3', null, m, true)
    }
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
      // for (let tag of plugin.tags)
      //   if (!(tag in tags)) tags[tag] = tag
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
      p: _p,
      uptime,
      muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp <= 0 ? `Siap untuk *${_p}levelup*` : `${max - exp} XP lagi untuk levelup`,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level,
      limit,
      name,
      weton,
      week,
      date,
      dateIslamic,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let txt = `Hi ${m.name} ${ucapan()}

${set.bot} Is an Rpg Playgrounds Bot made from node.js, python which is designed to create stickers, download music or videos, and play games like rpg

╭─────═[ INFO USER ]═─────⋆
│╭───────────────···
┴│☂ Name : ${conn.getName(m.sender)}
⬡│☂ Limit : ${limit}
⬡│☂ Level : ${level}
┬│☂ Role : ${role}
│╰────────────────···
┠─────═[ INFO BOT ]═─────⋆
│╭────────────────···
┴│☂ Uptime : ${uptime}
┬│☂ Version : ${set.version}
│╰────────────────···
┠─────═[ TODAY ]═─────⋆
│╭────────────────···
┴│☂ Date : ${date}
⬡│☂ Week : ${week}
┬│☂ Time : ${time}
╰──── •\n`
conn.temamenu = conn.temamenu ? conn.temamenu : {
            id: 1
        }
        if (conn.temamenu.id === 1) {
    await m.reply(Func.Styles(txt) + `\n` + Func.Styles(text.trim()))
        } else if (conn.temamenu.id === 2) {
conn.sendMessage(m.chat, {
text: Func.Styles(txt) + `\n` + Func.Styles(text.trim()),
contextInfo: {
externalAdReply: {
title: set.bot,
body: set.wm,
thumbnailUrl: media.thumbnail,
sourceUrl: sosial.gc,
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: m})
     } else if (conn.temamenu.id === 3) {
conn.sendFile(m.chat, media.video, 'dit.mp4', Func.Styles(txt) + `\n` + Func.Styles(text.trim()), m, true, {
  gifPlayback: true, contextInfo: {
externalAdReply: {
title: set.bot,
body: set.wm,
thumbnailUrl: media.thumbnail,
sourceUrl: null,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true
     }}}, m)
}
  } catch (e) {
    conn.reply(m.chat, 'Sorry the menu is in error', m)
    throw e
  }
}
handler.help = ['menu3', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.exp = 3
module.exports = handler

const more = String.fromCharCode(1)
const readMore = more.repeat(1)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "Don't forget to sleep :)"
  if (time >= 4) {
    res = "Selamat Pagi 🌤🏞"
  }
  if (time > 10) {
    res = "Selamat Siang ☀🏝"
  }
  if (time >= 15) {
    res = "Selamat Sore ⛅🌅"
  }
  if (time >= 18) {
    res = "Selamat Malam 🌙🌌"
  }
  return res
}