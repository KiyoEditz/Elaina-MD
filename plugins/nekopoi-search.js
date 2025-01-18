let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
const NekoPoi = require('../lib/nekopoi')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan judul yang ingin di cari!\n\nContoh:\n${usedPrefix}${command} blue archive`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper 
    const response = await NekoPoi.search(args[0]);
    var { type, title, images, url  } = response[0];
     //deskripsi = description.replace(/[^\S\r\n]+/g, '');
        let capt = `╭──── 〔NEKOPOI〕 ─⬣\n`;
        capt += ` ⬡ *Title* : ${title}\n`;
        capt += ` ⬡  *Type* : ${type}\n`;
        capt += `╰────────⬣\n`;  
        capt += ` ⬡  *Url* : ${url}\n`;
        let media = await prepareWAMessageMedia({ image: { url: images } }, { upload: conn.waUploadToServer });

        let msg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: {
                body: {
                  text: capt,
                },
                footer: {
                  text: wm,
                },
                header: proto.Message.InteractiveMessage.Header.create({
                ...media,
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
                nativeFlowMessage: {
                  buttons: [
                  {
                    "name": "cta_url",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "Saluran Update Bot",
                      url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O',
                      merchant_url: 'https://whatsapp.com/channel/0029VaiSfLQGpLHU6TP4tM1O'
                    })
                  },
                ],
                },
                contextInfo: {
                  quotedMessage: m.message,
                  participant: m.sender,
                  ...m.key
                }
              },
            },
          },
        };
      
        await conn.sendMessage(m.chat, { 
        image: { url: images }, 
        caption: msg
    }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['nekopoisearch'];
handler.command = /^(nekopoisearch|nekopois)$/i;
handler.tags = ['downloader','tools'];
handler.premium = true;
handler.nsfw = true;
module.exports = handler;