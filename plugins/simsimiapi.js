/*
let fetch = require('node-fetch')
let handler = async (m, { text }) => {
  if (!text) throw 'Ketikkan chat'
  let teks = text.replace(/[^A-Za-z]/g, '')
  let res = await fetch(global.API('https://api.simsimi.net', '/v2/', { text: encodeURIComponent(teks), lc: "id" }, ''))
  if (!res.ok) throw eror
  let json = await res.json()
  if (json.success == 'gapaham banh:v') return m.reply('lu ngetik apaaan sih')
  await m.reply(`${json.success}`)

}
handler.help = ['simi <chat>']
handler.tags = ['fun']
handler.command = /^((sim)?simi|simih)$/i

module.exports = handler
*/
// Jangan Hapus Wm Bang 
// *Ai simi  Plugins Esm*
// Ai Nya Toxic Anjir 
// *[Sumber]*
// https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28
// *[Sumber Scrape]*
// https://whatsapp.com/channel/0029VaDMn8D3mFYDKDGIFW2J/516

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

async function simSimi(text, languageCode = 'id') {
  const url = 'https://api.simsimi.vn/v1/simtalk';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  const data = new URLSearchParams();
  data.append('text', text);
  data.append('lc', languageCode);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data.toString(),
    });

    const rawResponse = await response.text();
    
    try {
      const jsonResponse = JSON.parse(rawResponse);
      return jsonResponse.message || 'Maaf, aku tidak mengerti.';
    } catch (error) {
      console.error('Respons bukan JSON:', rawResponse);
      return 'Maaf, ada kesalahan dalam memproses jawaban.';
    }
  } catch (error) {
    console.error('Error asking SimSimi:', error);
    return 'Maaf, terjadi kesalahan saat menghubungi SimSimi.';
  }
}

let handler = async (m, { text, args }) => {
  if (!text) return m.reply('Ketikkan chat');

  let language = 'id'; 
  let response = await simSimi(text, language);
  m.reply(response);
};

handler.help = ['simi <chat>']
handler.tags = ['fun','ai']
handler.command = /^((sim)?simi|simih)$/i


module.exports = handler;