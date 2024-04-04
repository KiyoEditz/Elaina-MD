const fetch = require('node-fetch')
let handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
    
if (!text) throw m.reply(`Masukkan textnya!\n\n*Contoh:* .brainly 5 dikali 5`)
try {
  var apii2 = await fetch(`https://mfarels.my.id/api/brainly?q=${text}`)
  var js2 = await apii2.json()
  m.reply(js2.result)
} catch(e) {
  try {
    var apii = await fetch(`https://mfarels.my.id/api/brainly?q=${text}`)
    var js = await apii.json()
    m.reply(js.data.data)
  } catch(e) {
    m.reply('Error: Server down!')
  }
}
}      
/*const baileys = require('@adiwajshing/baileys')
const { Brainly } = require('brainly-scraper-v2')
const fetch = require('node-fetch')
let brainly = new Brainly('id')

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Input Query'
  let res = await brainly.search(text, 'id').catch(() => null)
  console.log(res)
  if (res) {
    let answer = res.map(({ question, answers }, i) => `
            *Pertanyaan*${question.grade ? ` (${question.grade})` : ''}\n${question.content}${answers.map((v, i) => `
            *Jawaban Ke ${i + 1}*${v.verification ? ' (Verified)' : ''}${v.isBest ? ' (Best)' : ''}
            ${v.content}${v.attachments.length > 0 ? `\n*Media Url*: ${v.attachments.join(', ')}` : ''}`).join``}`).join('\n' + '-'.repeat(45))
    m.reply(answer.trim())
  } else {
    let answer = await (await fetch(API('violetics', '/api/media/brainly', { query: text }, 'apikey'))).json()
    answer = answer.result
    if (!answer.length) throw 'Not found'
    for (let x = 0; x < answer.length; x++) {
      await m.reply(`*${answer[x].pertanyaan}*\n_${answer[x].source}_\n${answer[x].jawaban}`)
      await baileys.delay(2000)
    }
  }
}*/
handler.help = ['brainly <soal>']
handler.tags = ['belajar']

handler.command = /^brainly$/i

module.exports = handler