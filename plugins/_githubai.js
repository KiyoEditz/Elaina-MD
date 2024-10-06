

const OpenAI = require("openai");

// Gunakan variabel lingkungan yang aman untuk menyimpan API key
const token = process.env["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"];

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Masukkan Prompt!\n\nContoh: *${usedPrefix + command} apakah kamu gpt-4?*`
    );
  }

  let client = new OpenAI({
    apiKey: token, // Gunakan token dari variabel lingkungan
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4", // Pastikan model yang benar
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // Sistem prompt opsional
        { role: "user", content: text }, // Prompt dari user
      ],
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    // Kirim hasil ke chat
    const result = response.choices[0].message.content;
    conn.reply(m.chat, result, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, "Terjadi kesalahan saat memproses permintaan.", m);
  }
};

handler.command = /^(githubai)$/i;
handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

module.exports = handler;

/*
Run this model in Javascript

> npm install openai

import OpenAI from "openai";

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings. 
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env["GITHUB_TOKEN"];

export async function main() {

  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token
  });

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "" },
      { role:"user", content: "What is the capital of France?" }
    ],
    model: "gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1
  });

  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
*/