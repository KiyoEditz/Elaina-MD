// By Cihuyy

let axios = require('axios');
let https = require('https');
let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys');
let handler = async(m, { conn, command, text, args }) => {
  if (!text) return conn.reply(m.chat, 'Mau cari apa?', m);
  await conn.reply(m.chat, 'Bentar yah aku cariin dulu :)', m);
  let namebot = 'Elaina-MD'
  let results = await pinterest(text);
  let res = results.image;
  let ult = res.slice(0, Math.min(4, res.length));
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
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "Source",
              url: `https://www.pinterest.com/search/pins/?rs=typed&q=${encodeURIComponent(text)}`,
              merchant_url: `https://www.pinterest.com/search/pins/?rs=typed&q=${encodeURIComponent(text)}`
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
            cards: [...cards]
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

const agent = new https.Agent({
  rejectUnauthorized: true,
  maxVersion: 'TLSv1.3',
  minVersion: 'TLSv1.2'
});

async function getCookies() {
  try {
    const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent });
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.map(cookieString => {
        const cookieParts = cookieString.split(';');
        return cookieParts[0].trim();
      });
      return cookies.join('; ');
    }
    return null;
  } catch {
    return null;
  }
}

async function pinterest(query) {
  try {
    const cookies = await getCookies();
    if (!cookies) return [];

    const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query: query,
          scope: "pins",
          no_fetch_context_on_resource: false
        },
        context: {}
      }),
      _: Date.now()
    };

    const headers = {
      'accept': 'application/json, text/javascript, */*, q=0.01',
      'accept-encoding': 'gzip, deflate',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': cookies,
      'dnt': '1',
      'referer': 'https://www.pinterest.com/',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
      'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-model': '""',
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-platform-version': '"10.0.0"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
      'x-app-version': 'c056fb7',
      'x-pinterest-appstate': 'active',
      'x-pinterest-pws-handler': 'www/[username]/[slug].js',
      'x-pinterest-source-url': '/hargr003/cat-pictures/',
      'x-requested-with': 'XMLHttpRequest'
    };

    const { data } = await axios.get(url, { httpsAgent: agent, headers, params });
    return data.resource_response.data.results
      .filter(v => v.images?.orig)
      .map(result => ({
        upload_by: result.pinner.username,
        fullname: result.pinner.full_name,
        followers: result.pinner.follower_count,
        caption: result.grid_title,
        image: result.images.orig.url,
        source: "https://id.pinterest.com/pin/" + result.id,
      }));
  } catch {
    return [];
  }
}