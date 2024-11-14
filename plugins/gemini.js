// Fungsi untuk mengimpor secara dinamis Gemini dari module ESM
const loadGemini = async () => {
  const { Gemini } = await import("gemini-g4f");  // Mengimpor menggunakan import dinamis
  return new Gemini("");
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Masukkan Prompt!\n\nContoh: *${usedPrefix + command} apakah kamu gpt4?*`, m
    );
  }

  // Memuat Gemini menggunakan dynamic import
  const gemini = await loadGemini();

  let res = await gemini.ask(text, {
    model: "gemini-1.5-pro-latest",
  });

  conn.reply(m.chat, res, m);
};

// Penamaan command handler
handler.command = /^(gemini2)$/i;
handler.help = ["gemini2"];
handler.tags = ["ai"];
handler.limit = true;

// Ekspor handler menggunakan CommonJS
module.exports = handler;
