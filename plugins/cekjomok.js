let handler  = async (m, { conn }) => {
  conn.reply(m.chat,`“${pickRandom(global.gay)}”`, m)
}
handler.help = ['jomokcek']
handler.tags = ['fun']
handler.command = /^(jomokcek)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = false

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.gay = [
'Jomok Level : 4%\n\nAman Cik😘!',
'Jomok Level : 7%\n\nMendinglah Rek😋',
'Jomok Level : 12%\n\nWaspada Calon Raja Iblis😲',
'Jomok Level : 22%\n\nWeladalah🥺',
'Jomok Level : 27%\n\nJomok Dikit🤭',
'Jomok Level : 35%\n\nJomok ¼😱',
'Jomok Level : 41%\n\nBahaya Wir🤯',
'Jomok Level : 48%\n\nSetengah Jomok😔',
'Jomok Level : 56%\n\nLu Jomok juga😫',
'Jomok Level : 64%\n\nAnjir Calon Sungut Lele🤨',
'Jomok Level : 71%\n\nWaduh😂',
'Jomok Level : 1%\n\n99% Slow Aja Keles😅!',
'Jomok Level : 77%\n\nCalon Calon Ini Mah Njir🤣',
'Jomok Level : 83%\n\nWaspada Pantat Hitam😋',
'Jomok Level : 89%\n\nJomok Banget Njir😆!',
'Jomok Level : 94%\n\nTOBAT WOEE,, JOMOK LU UDH MELEWATI BATAS!😂',
'Jomok Level : 100%\n\nLU ORANG TERJOMOK NJIR🤗',
'Jomok Level : 100%\n\nLU PECINTA LOBANG PANTAD BEJIR🤩',
'Jomok Level : 100%\n\nLU SI RAJA IBLIS🥵',
'Jomok Level : 100%\n\nDAH GA KETOLONG JOMOKNYA NIH ORANG🥰',
]