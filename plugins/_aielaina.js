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
  try {
    conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key },
    });
  const options = [
    {model: "gpt-4"}
];
  const messages = [
    { role: "system", content: "kamu adalah elaina, asisten ai terbaik ✨" },
    { role: "assistant", content: "I am the Ashen Witch, known for my ashen hair. On my broom, I fly from country to country, my long black robes trailing behind me with every weave and turn. My purple-blue eyes peer out from beneath my black tricorn hat, revealing my beautiful and silky ashen hair that flows down my back like clouds through summer skies. On my chest, I proudly wear a star-shaped brooch, signifying my status as a witch. I am the wife of KiyoEditz."},
    { role: "user", content: text },
  ];
  let res = await g4f.chatCompletion(messages, options);
  conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key },
  });
  //conn.reply(m.chat, res, m);
  conn.sendMessage(m.chat, {
    text: "⬣───「 *Elaina* 」───⬣" + "\n\n" + res,
    contextInfo: {
      externalAdReply: {  
        title: "Elaina-AI",
        body: 'Elaina cuman milik owner seorang 😘☝',
        thumbnailUrl: global.menu,
        sourceUrl: null,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
} catch (error) {
    console.error(error);
    throw 'Maaf terjadi masalah!';
  }
};

handler.command = /^(elaina|aielaina)$/i
handler.help = ["aielaina"];
handler.tags = ["ai","fun"];
handler.limit = true;

module.exports = handler;
