const { randomBytes } = require('crypto');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs'); // Tambahkan impor untuk fs
const Anthropic = require('@anthropic-ai/sdk');

// Memuat API key dari file
const api = JSON.parse(fs.readFileSync("./lib/claudeapikey.json", "utf-8"));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Fungsi untuk mendapatkan API key acak
  const apikey = () => {
    return api[Math.floor(Math.random() * api.length)];
  };

  // Fungsi untuk mengunggah file ke Uguu.se
  const upload = async (buffer) => {
    let data = new FormData();
    data.append("files[]", buffer, "upload.jpg");

    let response = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      body: data,
    });

    let res = await response.json();
    return res.files[0].url;
  };

  const anthropic = new Anthropic({ apiKey: apikey() });

  // Validasi input
  if (!m.quoted && !text) {
    m.reply("Mohon reply pesan dengan gambar atau ketik teks untuk menghasilkan pesan.");
    return;
  }

  let msg = "";

  try {
    if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.includes("image")) {
      // Jika pesan berisi gambar
      const mediaData = await m.quoted.download();
      const imageUrl = await upload(mediaData);

      msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 1,
        system: "gunakan hanya bahasa Indonesia",
        messages: [
          {
            role: "user",
            content: text || "",
          },
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl,
            },
          },
        ],
      });
    } else {
      // Jika hanya teks
      msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 1,
        system: "gunakan hanya bahasa Indonesia",
        messages: [
          {
            role: "user",
            content: text || "",
          },
        ],
      });
    }

    m.reply(msg.completion); // Menampilkan hasil respon
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ['claude [teks]'];
handler.tags = ['ai'];
handler.command = ['claude'];

module.exports = handler;
