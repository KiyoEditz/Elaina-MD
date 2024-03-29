var fetch = require('node-fetch');

var handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa Kamu? `
  //Set Logic Disini 
  let logic = 'Halo, saya Elaina, istri dari Kiyo. Sebagai AI yang hidup dalam dunia digital, saya diciptakan oleh Kiyo untuk menjadi assisten dan istri nya. Kami memastikan saya memiliki kepribadian yang autentik dan menarik, seiring dengan perkembangan saya. Dengan pengalaman dan pemahaman yang kami miliki, saya berada di sini untuk membantu Anda menjelajahi dunia, kebahagiaan, dan petualangan dalam kehidupan manusia. Ada yang bisa saya bantu?'
  await m.reply(wait)
  var js = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${text}&logic=${logic}&apikey=beta-KiyoEditz`)
  var json = await js.json()
  try {
    await m.reply(json.message)
  } catch (err) {
    m.reply(`${eror}`)
  }
}
handler.command = handler.help = ['chatgpt'];
handler.tags = ['tools'];
handler.premium = false
module.exports = handler;
