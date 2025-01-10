const { steam } = require('../lib/steam');

let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys');
let handler = async(m, { conn, command, text, args }) => {
  if (!text) {
    throw `Masukkan judul yang ingin di cari!\n\nContoh:\n${usedPrefix}${command} miside`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._\n*Mohon matikan auto download pada WhatsApp.*\n*File trailers yang di kirim bot berukuran besar*`, m);

    // Mengambil respons dari scraper 
    const response = await steam(text);
    var { id, name, description, screenshots, trailers, price, developers, genres, release, url } = response;
     //deskripsi = description.replace(/[^\S\r\n]+/g, '');
        let capt = `╭──── 〔STEAM〕 ─⬣\n`;
        capt += ` ⬡ *Title* : ${name}\n`;
        capt += ` ⬡ *ID* : ${id}\n`;
        capt += ` ⬡ *Genre* : ${genres}\n`;
        capt += ` ⬡  *Price* : ${price}\n`;
        capt += ` ⬡ *Release* : ${release}\n`;
        capt += ` ⬡  *Developers* : ${developers}\n`;
        capt += ` ⬡  *Url* : ${url}\n`;
        capt += `╰────────⬣\n`;  
        capt += ` ⬡  ${description}\n`;  
        await conn.sendMessage(m.chat, { 
        image: { url: trailers[0].mp4 }, 
        caption: capt
    }, { quoted: m });
    let ult = screenshots.splice(0, screenshots.length);
    let i = 1;
    let cards = [];

    for (let pus of ult) {
      cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Screenshots ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: name 
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: '</> Steam </>\n',
        hasMediaAttachment: true,
        imageMessage: await createImage(pus)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text:"Source",
              url:"${url}",
              merchant_url:"${url}"
              })
          }
        ]
      })
    });
  }
  
  const bot = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: null
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: namebot
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              ...cards
            ]
          })
        })
      }
    }
  }, {});
  
  await conn.relayMessage(m.chat, bot.message, {
    messageId: bot.key.id
  });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['steam'];
handler.command = /^(steam)$/i;
handler.tags = ['search','tools'];
handler.premium = false;
handler.limit = true;
module.exports = handler;

async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: {
        url
      }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }