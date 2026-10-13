const { GoogleGenerativeAI } = require("@google/generative-ai");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const apiKey = global.gemini || global.geminiKey || "";
  if (!apiKey) return m.reply("API key Gemini belum dikonfigurasi di config.js");
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return m.reply(`• *Example:* ${usedPrefix + command} selamat pagi`);
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  try {
    if (!mime) {
      const result = await geminiModel.generateContent(text);
      const response = result.response.text();

      if (!response) throw new Error("Response tidak valid dari API");

      await conn.sendMessage(m.chat, { text: response }, { quoted: m });
    } else {
      let media = await q.download();
      const imageBase64 = Buffer.from(media).toString("base64");
      const mimeType = mime || "image/jpeg";

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };

      const result = await geminiModel.generateContent([imagePart, text]);
      const response = result.response.text();

      if (!response) throw new Error("Response tidak valid dari API");

      await conn.sendMessage(m.chat, { text: response }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    m.reply(`Terjadi kesalahan saat memproses permintaan: ${e.message || e}`);
  }
};

handler.help = ["gemini"].map(a => a + " *<text>*");
handler.tags = ["ai"];
handler.command = /^(gemini)$/i;
handler.limit = true;
handler.register = true;
module.exports = handler;