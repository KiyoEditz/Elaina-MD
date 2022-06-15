let handler = async (m, { conn, text, usedPrefix, args }) => {
  let type = (args[0] || '').toLowerCase()
  let tasya = './src/vn/tasya/tasyawk.opus'
  let tasya2 = './src/vn/tasya/tasyawk2.opus'
  let tasya3 = './src/vn/tasya/tasyawk3.opus'
  let tasya4 = './src/vn/tasya/tasyawk4.opus'
  let tasya5 = './src/vn/tasya/tasyakiss.opus'
  switch (type) {
    case 'ketawa':
      conn.sendFile(m.chat, tasya, 'tasya.opus', null, m, true)
      break
    case 'ngukuk':
      conn.sendFile(m.chat, tasya2, 'tasya.opus', null, m, true)
      break
    case 'bengek':
      conn.sendFile(m.chat, tasya3, 'tasya.opus', null, m, true)
      break
    case 'ngakak':
      conn.sendFile(m.chat, tasya4, 'tasya.opus', null, m, true)
      break
    default:
      return m.reply(`
List Vn Tasya :
Ketawa | ngukuk | bengek | ngakak 

Contoh:
${usedPrefix}tasya ketawa
${usedPrefix}tasya ngakak
`.trim())
  }
}
handler.command = /^(tasya)$/i

handler.fail = null

module.exports = handler
