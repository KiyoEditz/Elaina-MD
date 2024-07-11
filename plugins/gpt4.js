const { G4F } = require("g4f");

let g4f = new G4F();

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
  const options = [
    {model: "gpt-4"}
];
  const messages = [
    { role: "system", content: "Elaina-MD adalah bot WhatsApp yang terbuat dari Nodejs, Python. Untuk membantu anda dalam mengerjakan dalam hal apapun." },
    { role: "user", content: text },
  ];
  let res = await g4f.chatCompletion(messages, options);
  conn.reply(m.chat, res, m);
};

handler.command = /^(gpt4|ai)$/i
handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

module.exports = handler;
