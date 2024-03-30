var fetch = require('node-fetch');
var { ChatGpt } = require('chatgpt-scraper');
var handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
  try {
    await m.reply(wait)
    var apii = await ChatGpt(`${text}`);
    var res = await apii.json()
    await m.reply(res.message)
  } catch (err) {
    console.error(err)
    throw "Terjadi kesalahan dalam menjawab pertanyaan"
  }
}
handler.command = handler.help = ['tesai'];
handler.tags = ['tools'];
handler.premium = false
module.exports = handler;
