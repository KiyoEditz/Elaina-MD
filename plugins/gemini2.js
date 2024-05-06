

const axios = require("axios")
const uploadImage = require('../lib/uploadImage.js')


let handler = async (m, {
conn,
text,
usedPrefix,
command
}) => {
 
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || ''

  if (!text) {
    return m.reply(`Masukkan Pertanyaan!\n\nContoh: *${usedPrefix + command} Hai*`)
  }
  m.react('🕒')
  if (/image/.test(mime)) {
  let img = await q.download();
  let url = await uploadImage(img);
  
  let res = await geminijpg(text, url)
  conn.reply(m.chat, res, m)
} else { 
try { 
let res1 = await gemini(text)
conn.reply(m.chat, res1, m)
    } catch (e) {
    console.log(e)
    return m.reply('Maaf AI tidak dapat mencari informasi tersebut!')
  }
 }
}

handler.command = handler.help = ["gemini", "geminiimage", "geminiai", "aigemini"]
handler.tags = ["ai"]
handler.limit = 10

module.exports = handler

async function gemini(prompt) {
  try {
    const response = await axios.post('https://bard.rizzy.eu.org/backend/conversation/gemini', {
      ask: prompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return response.data.content;
  } catch (error) {
    console.error(error);
  }
}

async function geminijpg(prompt, image) {
  try {
    const response = await axios.post('https://bard.rizzy.eu.org/backend/conversation/gemini/image', {
      ask: prompt,
      image: image
    }, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return response.data.content;
  } catch (error) {
    console.error(error);
  }
      }
