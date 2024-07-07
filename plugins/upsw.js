const fetch = require("node-fetch");
const uploadFile = require('../lib/uploadFile.js')
const uploadImage = require('../lib/uploadImage.js')

let commandList = ["upsw"];

let mimeAudio = 'audio/mpeg';
let mimeVideo = 'video/mp4';
let mimeImage = 'image/jpeg';

let handler = async (m, { conn, command, args }) => {
  let teks
    if (args.length >= 1) {
        teks = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        teks = m.quoted.text
    }

  if (m.quoted && m.quoted.mtype) {
    let mtype = m.quoted.mtype;
    let type;

    if (mtype === 'audioMessage') {
      type = 'vn';
    } else if (mtype === 'videoMessage') {
      type = 'vid';
    } else if (mtype === 'imageMessage') {
      type = 'img';
    } else if (mtype === 'extendedTextMessage') {
      type = 'txt';
    } else {
      throw "❌ Media type tidak valid!";
    }

    let doc = {};
    
    if (type === 'vn') {
    	let link = await (type === 'img' ? uploadImage : uploadFile)(await m.quoted.download());
      doc.mimetype = mimeAudio;
      doc.audio = { url: link } ? { url: link } : generateVoice("id-ID", "id-ID-ArdiNeural", teks);
    } else if (type === 'vid') {
    	let link = await (type === 'img' ? uploadImage : uploadFile)(await m.quoted.download());
      doc.mimetype = mimeVideo;
      doc.caption = teks;
      doc.video = { url: link } ? { url: link } : { url: giflogo };
    } else if (type === 'img') {
    	let link = await (type === 'img' ? uploadImage : uploadFile)(await m.quoted.download());
      doc.mimetype = mimeImage;
      doc.caption = teks;
      doc.image = { url: link } ? { url: link } : { url: logo };
    } else if (type === 'txt') {
      doc.text = teks;
    }
    
    await conn.sendMessage('status@broadcast', doc, {
      backgroundColor: getRandomHexColor(),
      font: Math.floor(Math.random() * 9),
      statusJidList: Object.keys(global.db.data.users)
    }).then((res) => {
      conn.reply(m.chat, `Sukses upload ${type}`, res);
    }).catch(() => {
      conn.reply(m.chat, `Gagal upload ${type}`, m);
    });
  } else {
    throw "❌ Tidak ada media yang diberikan!";
  }
};

handler.help = commandList;
handler.tags = ["main"];
handler.owner = true;
handler.rowner = true
handler.command = new RegExp(`^(${commandList.join('|')})$`, 'i');

module.exports = handler;

async function generateVoice(Locale = "id-ID", Voice = "id-ID-ArdiNeural", Query) {
    let content = `<voice name="${Voice}">${Query}</voice>`; 
    let formData = new FormData();
    formData.append("locale", Locale);
    formData.append("content", content); 
    formData.append("ip", '46.161.194.33');
    let response = await fetch('https://app.micmonster.com/restapi/create', {
        method: 'POST',
        body: formData
    });
    return Buffer.from(('data:audio/mpeg;base64,' + await response.text()).split(',')[1], 'base64');
}
function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}