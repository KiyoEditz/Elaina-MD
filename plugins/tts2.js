const fetch = require('node-fetch');

var handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `Masukkan teks \n\n*Contoh:*.tts Siapa presiden Indonesia? `
    // try {


    const url = 'https://api.play.ht/api/v2/tts/id?format=audio-mpeg';
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
    //let api = await api(url, options);
    // let data = await res.json(); 
    // let tts = await fetch(url, options)
    // let res = await tts.json()
    // console.log(res)
    // return
    // conn.sendFile(m.chat, tts, 'tts.opus', null, m, true);
    // } catch (e) {
    //     // m.reply('*maaf terjadi kesalahan!*');
    // }
};
handler.help = ['tts2 <teks>'];
handler.tags = ['tools'];
handler.command = /^tts2$/i;
module.exports = handler;
