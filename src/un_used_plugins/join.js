let linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
let fs = require('fs')
let handler = async (m, { conn, args, usedPrefix, command, isPrems, isOwner }) => {
  // if (conn.user.jid == global.conn.user.jid) return
  if (!args[0]) throw `_Masukkan link Groupmu_\n\nContoh:\n${usedPrefix}join https://chats.whatsapp.com/LinkUrl`

  let [_, code] = args[0].match(linkRegex) || []
  if (!code) throw `_Link Salah_\n\nContoh:\n${usedPrefix}join https://chats.whatsapp.com/LinkUrl`
  m.reply(code)
  const json = JSON.parse(fs.readFileSync('./src/group.json'))
  let data = {}
  let chatnow = conn.chats.all().map(v => v.jid)
  let isTrial = /trial/i.test(command)
  let res = await conn.query({
    json: ["query", "invite", code],
    expect200: true
  })
  if (!res) throw res


  if (!(res.id in global.db.data.chats)) global.db.data.chats[res.id] = {
    trial: 0
  }

  //let jadibot = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)]), global.conn.user].map(v => v.jid).filter(v => v !== conn.user.jid)
  // let meta = await conn.groupMetadata(res.id)
  // let member = meta.participants.map(u => u.jid)
  // for (let u of jadibot) {
  //   if (member.includes(u)) throw 'Sudah ada bot cloning disitu'
  // }
  let nama = await conn.getName(res.id)
  let chat = global.db.data.chats[res.id]
  let user = global.db.data.users[m.sender]
  if (chatnow.includes(res.id)) throw `Bot sudah ada di group itu`
  if (isTrial && chat.trial == 1) throw 'Group itu sudah trial sebelumnya'
  if (isOwner || isPrems) {
    await conn.acceptInvite(code).catch(() => { throw 'Gagal! Kemungkinan:\n- Link salah/telah diganti\n- Bot telah dikeluarkan (Harus Invite manual)' })
    m.reply(`Berhasil join grup ${res.id}`)
    await conn.sendButton(res.id, `
╔══════════════
╟「 *${conn.user.name}* 」
╠═══════════════
╟   *Hai Member*
╟   Terimakasih telah ${isTrial ? `mengundang ` : `menyewa `} *${conn.user.name}*
╟   ${!isTrial ? `( Karena ini adalah masa percobaan, Bot akan keluar setalah 12 jam )` : ``}
╟   *Prefix/perintah:* ! # . /
╟   Pilih prefix sesuai kenyamanan mengetik
╟   
╟   ketik *(prefix)help/menu* untuk memulai
╟   Contoh: ${usedPrefix}help
╟   ${conn.readmore}
╠═══════════════
╟   Jadikan bot sebagai admin
╟   agar lebih maksimal (no Kudeta)
╠═══════════════
╟   *Catatan untuk semua member group*
╟   • Bot ini on always 24 Jam
╟   • Jangan spam bot di group
╟   • Jika bot tidak merespon, 
╟     Jangan spam. Kemungkinan bot
╟     sedang delay (terlalu banyak chat)
╟   • Penyalahgunaan bot
╟     pada group ditanggung member
╟   
╟   Disarankan untuk :
╟   • Membisukan notifikasi group
╟   • Mematikan download otomatis,
╟     karena bot ini berpotensi
╟     mengirim berbagai media
╟   
╟   Sekian, Terimakasih.. Have fun ^_^
╚════════════════
    `.trim(), 'Jika ada yang ditanyakan, hubungi Owner', 3, ['Menu', '.menu', 'Setting', '.setting', 'Owner', '.owner'], m)
    let masa
    if (isOwner) masa = 30
    else if (isPrems) masa = Math.floor((db.data.users[m.sender].premdate - new Date * 1) / 86400000)
    if (isTrial) masa = 0.5
    let date = new Date() * 1 + (86400000 * masa)
    chat.gcdate = date
    chat.trial = isTrial ? 1 : 0

    data.nama = conn.getName(res.id)
    data.id = res.id
    data.joiner = m.sender.split`@`[0] + (isOwner ? '' : ' (Premium)')
    data.expired = isOwner ? new Date() * 1 + 2592000000 : user.premdate
    json.push(data)
    fs.writeFileSync('./src/group.json', JSON.stringify(json))

    await conn.reply('6287857180075-1625188898@g.us', `
${isTrial ? 'Trial' : 'Sewa'} ${isOwner ? '' : ' (Premium)'}
*${await conn.getName(m.sender)}*

ID: ${res.id}
Group: ${nama}
Link: ${args[0]}
Tanggal: ${new Date().toLocaleDateString('id', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}
Expired: ${new Date(date).toLocaleDateString('id', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}
    `.trim(), 0)
  } else {
    conn.reply('6281999284127@s.whatsapp.net', `*[ REQ JOIN ]*\nNomor : wa.me/${m.sender.split("@")[0]}\nLink : chat.whatsapp.com/${code}`)
    conn.reply(m.chat, '_Terimakasih_\n\nBot akan masuk ke Grup anda setelah dikonfirmasi oleh Owner Bot\n*NOTE:* Antri ya.. banyak yang request.. Dan kalau di terima sekaligus akan menyebabkan lag pada bot', m)
  }
}
handler.help = ['join <chat.whatsapp.com/linkUrl>']
handler.tags = ['premium']
handler.command = /^(join|trial)$/i
handler.private = true