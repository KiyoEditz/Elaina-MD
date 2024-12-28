const { randomBytes } = require('crypto');
const fetch = require('node-fetch');
const FormData = require('form-data');
const Anthropic = require('@anthropic-ai/sdk');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const apikey = () => {
    const antro = [
      "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",
      "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",
      "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",
      "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",
      "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",
      "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",
      "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",
      "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"
    ];
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

  const anthropic = new Anthropic({ apiKey: apikey() });

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
