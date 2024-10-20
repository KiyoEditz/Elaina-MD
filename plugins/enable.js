let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, isMods }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let setting = global.db.data.settings[conn.user.jid]
  let type = (args[0] || '').toLowerCase()
  let isAll = false
  let isUser = false
  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = !isEnable
      break
    case 'autodelvn':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autodelvn = isEnable
      break
    case 'document':
      user.useDocument = isEnable
      break
    case 'stiker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.stiker = isEnable
      break
    case 'game':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.game = isEnable
      break
    case 'public':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
    case 'restrict':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.restrict = isEnable
      break
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
    case 'viewonce':
    case 'autoviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
    case 'autolevelup':
    case 'levelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'mycontact':
    case 'mycontacts':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break
    case 'grouponly':
      isAll = true
      if (!(isOwner || isMods)) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.groupOnly = isEnable
      break
    case 'backup':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.backup = isEnable
      break
          case 'backupsc':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.backupsc = isEnable
      break
    case 'anticall':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.anticall = isEnable
      break
    case 'antitag':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.antitag = isEnable
      break
    case 'autoread':
    case 'read':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.autoread = isEnable
      break
    case 'autoreact':
    case 'react':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.autoreact = isEnable
      break
    case 'respon':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.autoresp = isEnable
      break
    case 'anon':
    case "anonymous":
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      setting.anonymous = isEnable
      break
    default:
      if (!/[01]/.test(command)) throw `
╔═〘 Daftar Opsi 〙
║ ${m.isGroup && isAdmin ? `
║ *Opsi Admin Group*
╟ welcome
╟ delete
╟ antilink
╟ detect
╟ viewonce
║` : ''}
║ *Opsi User*
╟ autolevelup (otomatis levelup)
╟ document (mp3, mp4 dikirim 
║ bentuk document)
║ ${isOwner ? ` 
║ *Opsi Owner*
╟ antitag
╟ anticall
╟ grouponly
╟ backup
╟ backupsc
╟ public
╟ whitelistmycontacts
╟ autodelvn
╟ restrict (add,kick,etc)
╟ autoread
╟ autoreact
╟ anon` : ''}
╚════
Contoh:
${usedPrefix}on welcome
${usedPrefix}off welcome
`.trim()
      throw false
  }
  m.reply(`
*${type}* berhasil di *${isEnable ? 'nyala' : 'mati'}kan* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}
`.trim())
}
handler.help = ['on', 'off', 'enable', 'disable', '1', '0'].map(v => v + ' <opsi>')
handler.tags = ['main']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

module.exports = handler