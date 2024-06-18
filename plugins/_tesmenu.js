const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = require('@adiwajshing/baileys');
  const moment = require("moment-timezone");
  const fetch = require("node-fetch");
  let levelling = require('../lib/levelling')
  let handler = async (m, {
    conn,
    groupMetadata,
    usedPrefix,
    command
  }) => {
    let { limit, role, level, exp, premiumTime } = db.data.users[m.sender]
  let ucpn = ucapan()
    let nembot = global.namebot
    let namebot = global.namebot
    let name =  `@${m.sender.split`@`[0]}`
    let ppl = await (await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'));
    const text = ` >Ingin di Ungkapan, Namun Takut Merubah Suasana.\n`;
    const caption = `> ────────────────\n*Halo, ${ucpn}*\n*${nembot}* stands as your dedicated assistant on WhatsApp, meticulously crafted to enhance your experience and streamline your interactions on the platform.\n\n_*Your Information*_\n☭ *Name:* ${name}\n✡ *Status:* ${premiumTime > 0 ? 'Premium' : 'Free user' }\n⚜ *Role:* ${role}\n⟐ *Level:* ${level}\n> ────────────────`;
    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: caption.trim()
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: footer
            }),
            header: proto.Message.InteractiveMessage.Header.create({
    ...(await prepareWAMessageMedia({
      image: {
        url: 'thumbnail.jpg' //buat thumb video
      }
    }, {
      upload: conn.waUploadToServer
    })),
    title: text,
    gifPlayback: true,
    subtitle: namebot, //ganti aja
    hasMediaAttachment: false
  }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [{
                   "name": "quick_reply",
                  "buttonParamsJson": "{\"display_text\":\"TQTO\",\"id\":\".tqto\"}"
                },
                {
                "name": "quick_reply",
                  "buttonParamsJson": "{\"display_text\":\"RUNTIME\",\"id\":\".runtime\"}"
                },
                {
                  "name": "quick_reply",
                  "buttonParamsJson": "{\"display_text\":\"OWNER\",\"id\":\".owner\"}"
                },
                {
                  "name": "quick_reply",
                  "buttonParamsJson": "{\"display_text\":\".menu all\",\"id\":\".menu all\"}"
                }
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '0@newsletter',
                newsletterName: name,
                serverMessageId: 143
              },
              externalAdReply: {
                          title: ucapan(),
                          body: namebot,
                          mediaType: 1,
                          previewType: 0,
                          renderLargerThumbnail: false,
                          thumbnailUrl: 'thumnail.jpg',
                          sourceUrl: ''
                      }
            }
          })
        }
      },
    }, {});
  
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  };
  
  handler.help = ["menu2"];
  handler.tags = ["main"];
  handler.command = /^(menu2)$/i;
  
  //handler.register = true;
  
  module.exports = handler;
  
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  
  function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    res = "Jangan Lupa Tidur Kak💗"
    if (time >= 4) {
      res = "『ѕєℓαмαт ραgι кαк🌄』"
    }
    if (time > 10) {
      res = "『ѕєℓαмαт ѕιαиg кαк🏞』"
    }
    if (time >= 15) {
      res = "『ѕєℓαмαт ѕσяє кαк🌆』"
    }
    if (time >= 18) {
      res = "『ѕєℓαмαт мαℓαм кαк🌃』"
    }
    return res
  }