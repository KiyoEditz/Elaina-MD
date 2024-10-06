let handler = async (m, { conn, command, text }) => {
	
    if (!text) return conn.reply(m.chat, 'Ketik Namanya Tolol!', m)
	
  conn.reply(m.chat, `
*––––––『 CEK - KON 』––––––*
• Nama : ${text}
• Kontol : ${pickRandom(['ih item','Belang wkwk','Muluss','Putih Mulus','Black Doff','Pink wow','Item Glossy'])}
• True : ${pickRandom(['perjaka','ga perjaka','udah pernah dimasukin','masih ori','jumbo'])}
• Jembut : ${pickRandom(['lebat','ada sedikit','gada jembut','tipis','muluss'])}
`.trim(), m)
}
handler.help = ['cekkontol <nama>']
handler.tags = ['fun']
handler.command = /^cekkontol/i
handler.premium = false
module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}