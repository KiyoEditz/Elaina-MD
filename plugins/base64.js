let handler = async (m, { command, text }) => {
  let txt = text ? text : m.quoted.text
  if (!text) throw `Masukan text`
  m.reply(Buffer.from(txt, 'utf-8').toString('base64'))
}
handler.help = ['base64 <teks>']
handler.tags = ['tools']
handler.command = /^base64$/i

module.exports = handler
