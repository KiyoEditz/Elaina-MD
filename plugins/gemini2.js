const { UguuSe } = require("../lib/uploadImage");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc");
const geminiProModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const geminiFlashModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return m.reply("• *Example:* .gemini selamat pagi");
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  
  try {
    if (!mime) {
      const result = await geminiFlashModel.generateContent(text);
      const response = result.response.text();
      
      if (!response) throw new Error("Response tidak valid dari API");

      await conn.sendMessage(m.chat, {
        text: response,
        contextInfo: {
          externalAdReply: {
            title: 'GEMINI-PRO / VISION',
            thumbnailUrl: 'https://telegra.ph/file/4bae3d5130aabcbe94588.jpg',
            sourceUrl: 'https://gemini.google.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      let media = await q.download();
      let isTele = /image\/(png|jpe?g)/.test(mime);
      let link = await UguuSe(media);
      
      const imageResp = await fetch(link.url).then(response => response.arrayBuffer());
      
      const imageBase64 = Buffer.from(imageResp).toString("base64");
      
      const mimeType = mime || "image/jpeg";
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };
      
      const result = await geminiProModel.generateContent([imagePart, text]);
      const response = result.response.text();
      
      if (!response) throw new Error("Response tidak valid dari API");

      await conn.sendMessage(m.chat, {
        text: response,
        contextInfo: {
          externalAdReply: {
            title: 'GEMINI-PRO / VISION',
            thumbnailUrl: link,
            sourceUrl: 'https://gemini.google.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat memproses permintaan.");
  }
};

handler.help = ["gemini"].map(a => a + " *<text>*");
handler.tags = ["ai"];
handler.command = /^(gemini)$/i;
handler.limit = true;
handler.register = true;
module.exports = handler;