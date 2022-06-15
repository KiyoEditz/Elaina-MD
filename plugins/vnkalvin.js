let handler = async (m, { conn, text, usedPrefix, args }) => {
  let type = (args[0] || '').toLowerCase()
  let hi = './src/vn/fadil/kalvinHai.opus'
  let bucin = './src/vn/fadil/kalvinBucin.opus'
  let gimana = './src/vn/fadil/kalvinGimana.opus'
  let pagi = './src/vn/fadil/kalvinPagi.opus'
  let cerpen = './src/vn/fadil/kalvinCerpen.opus'
  switch (type) {
    case 'hai':
      conn.sendFile(m.chat, hi, 'suara.opus', null, m, true)
      break
    case 'bucin':
      conn.sendFile(m.chat, bucin, 'suara.opus', null, m, true)
      break
    case 'pagi':
      conn.sendFile(m.chat, pagi, 'suara.opus', null, m, true)
      break
    case 'bingung':
      conn.sendFile(m.chat, gimana, 'suara.opus', null, m, true)
      break
    case 'bunda':
      conn.sendFile(m.chat, cerpen, 'suara.opus', null, m, true)
      break
    default:
      return m.reply(`
List Vn Fadil :
bucin | hai | bunda | pagi | bingung

Contoh:
${usedPrefix}fadil bucin
`.trim())
  }
}
handler.command = /^(fadil|kalvin)$/i

handler.fail = null

module.exports = handler
