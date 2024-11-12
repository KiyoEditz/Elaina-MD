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
conn.reply(m.chat, " ERROR: {e}", m):
  }
};

handler.command = /^(gpt4|ai)$/i
handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

module.exports = handler;