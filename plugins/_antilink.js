let handler = m => m

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
handler.before = async function (m, { user, groupMetadata, bot }) {
  if (!m.isGroup) return true
  if (m.isBaileys && m.fromMe) return true
  let chat = global.db.data.chats[m.chat]
  let isGroupLink = linkRegex.test(m.text)
  // let link_we = this.groupInviteCode(m.chat)
  // if (m.text.includes(link_we)) m.reply(`Link group sendiri sih,, gapapa`)
  // else
  if (chat.antiLink && isGroupLink) {
    m.reply('_Link group terdeteksi.._\n\nGroup ini anti link!')
    if (user.admin) return true

    if (bot.admin) {
      if (global.opts['restrict'] || global.db.data.settings[this.user.jid].restrict) {
        await m.reply('_Kamu akan di kick.._')
        this.groupRemove(m.chat, [m.sender])
      }
    } else m.reply('_Group ini Anti link.._\n\nBot bukan admin, ga bisa kick :|')
  }
  return true
}
module.exports = handler