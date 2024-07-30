let { generateWAMessageContent } = require("@whiskeysockets/baileys");

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || "";
  if (!/webp|image|video|gif|viewOnce/g.test(mime))
    return m.reply(
      `*• Example :* ${usedPrefix + command} *[reply/send media]*`,
    );
  let media = await q.download();
  let msg = await generateWAMessageContent(
    {
      video: media,
    },
    {
      upload: conn.waUploadToServer,
    },
  );
  await conn.relayMessage(
    m.chat,
    {
      ptvMessage: msg.videoMessage,
    },
    {
      quoted: m,
    },
  );
};
handler.help = ["toptv [reply/send media]"];
handler.tags = ["tools"];
handler.command = ["toptv"];
module.exports = handler;