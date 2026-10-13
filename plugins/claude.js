const { randomBytes } = require('crypto');
const fetch = require('node-fetch');
const FormData = require('form-data');
const Anthropic = require('@anthropic-ai/sdk');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const apikey = () => {
    const antro = Array.isArray(global.anthropic) ? global.anthropic : [global.anthropic].filter(Boolean);
    if (!antro.length) return '';
    return antro[Math.floor(Math.random() * antro.length)];
  };

  const upload = async (buffer) => {
    let data = new FormData();
    data.append("files[]", buffer, "upload.jpg");

    let response = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      body: data
    });

    let res = await response.json();
    return res.files[0].url;
  };

  const currentKey = apikey();
  if (!currentKey) return m.reply("API key Anthropic / Claude belum diatur di config.js!");
  const anthropic = new Anthropic({ apiKey: currentKey });

  if (!m.quoted && !text) {
    m.reply("Mohon reply pesan dengan gambar atau ketik teks untuk menghasilkan pesan.");
    return;
  }

  let msg = "";

  try {
    if (m.quoted && m.quoted.mimetype.includes("image")) {
      const mediaData = await m.quoted.download();
      const up = await upload(mediaData);
      const base64Data = Buffer.from(up, "binary").toString("base64");

      msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 1,
        system: "gunakan hanya bahasa Indonesia",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: text || "" },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: m.quoted.mimetype,
                  data: base64Data
                }
              }
            ]
          }
        ]
      });
    } else {
      msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 1,
        system: "gunakan hanya bahasa Indonesia",
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: text || "" }]
          }
        ]
      });
    }

    m.reply(msg.content[0].text);
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ['claude [teks]'];
handler.tags = ['ai'];
handler.command = ['claude'];

module.exports = handler;
