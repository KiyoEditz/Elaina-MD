// By Cihuyy

let axios = require('axios');
let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys');
let handler = async(m, { conn, command, text, args }) => {
  if (!text) return conn.reply(m.chat, 'Mau cari apa?', m);
  await conn.reply(m.chat, 'Bentar yah aku cariin dulu :)', m);
  let namebot = 'namabotmu'
    let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
    let res = data.resource_response.data.results.map(v => v.images.orig.url);
    let ult = res.splice(0, 4);
    let i = 1;
    let cards = [];

    for (let pus of ult) {
      cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Image ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: nameowner
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: '</> Pinterest </>\n',
        hasMediaAttachment: true,
        imageMessage: await createImage(pus)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            "name": "cta_url",
            "buttonParamsJson": {"display_text":"Source","url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}","merchant_url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}"}
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
}

handler.help = ['pinterest2'];
handler.tags = ['downloader'];
handler.command = /^(pinterest2|pin2)$/i;
handler.limit = true;
handler.register = true;

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