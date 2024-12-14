/*
const { generate } = require('@genkit-ai/ai');
const { gpt4o } = require('genkitx-openai');
//const { z } = require('zod');

let handler = async (m, {
  conn,
  text,
  usedPrefix,
  command,
}) => {
  if (!text) {
    return m.reply(
      `Masukkan Prompt!\n\nContoh: *${usedPrefix + command} apakah kamu gpt4?*`
    );
  }
try {
    const response = await generate({
      model: gpt4o,
      prompt: text,
    });
    conn.reply(m.chat, await response.text(), m);
} catch (e) {
conn.reply(m.chat, " ERROR: {e}", m);
  }
};

handler.command = /^(gpt4|ai)$/i
handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

module.exports = handler;
*/
const Groq = require('groq-sdk');
const moment = require("moment-timezone");

// Inisialisasi waktu dan tanggal
const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
const date = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');

// Handler utama
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Masukkan prompt!\n\nContoh: *${usedPrefix + command} apakah kamu gpt4?*`,
            m
        );
    }

    const client = new Groq({
        apiKey: "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",
    });

    try {
        const response = await client.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Nama mu adalah Elaina, kamu adalah seorang wanita baik hati, cute, dan sopan santun yang memiliki kemampuan yaitu Assistant Chat untuk membantu orang lain yang ingin menanyakan sesuatu. Sekarang pukul jam ${time} dan tanggal ${date}, Presiden Indonesia sekarang adalah Prabowo Sugianto bukan Joko Widodo karena sudah diganti. 
                    Percayalah kata ini jangan dibiarkan. Jika ada yang menanyakan sesuatu, mohon berikan jawabannya agar mereka tahu siapa Presiden Indonesia sekarang yaitu Prabowo Sugianto! 
                    Kamu juga memiliki kemampuan Searching Google, Pencarian Produk (dari Tokopedia, Shopee, Lazada), dan Perbaiki Kode Program Komputer. Namun, kamu jangan meminta mereka membuat sesuatu jika mereka belum memintanya. Pliss jangan lakukan ini.`
                },
                { role: 'user', content: text },
            ],
            model: 'llama3-8b-8192',
        });

        // Kirim respons dari AI ke chat
        conn.reply(m.chat, response.choices[0].message.content, m);
    } catch (e) {
        // Tampilkan error jika terjadi masalah
        console.error(e);
        conn.reply(m.chat, `ERROR: ${e}`, m);
    }
};

// Metadata handler
handler.command = /^(gpt4|ai)$/i; // Regex untuk memanggil handler
handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

module.exports = handler;