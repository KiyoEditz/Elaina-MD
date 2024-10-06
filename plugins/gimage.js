const fetch = require ('node-fetch');
let { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys');
const { googleImage } = require ('@bochilteam/scraper');

var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} anu`
    const wait = 'Tunggu Sebentar!....'; // Define wait message
    const wm = 'Elaina-MD'; // Define watermark text
    const errorMessage = 'Erro cik. Pasti lu cari gambar 4no'; // Define error message

    m.reply(wait)
    try {
        const res = await googleImage(text)
        let image = res.getRandom()
        let link = image
        let msgs = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `Nih Foto ${text}nya\nSource : Google`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: wm
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: true,
                            ...await prepareWAMessageMedia({ image: { url: link } }, { upload: conn.waUploadToServer })
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                name: "quick_reply",
                                buttonParamsJson: `{\"display_text\":\"Next Image ${text}\",\"id\":\".gimage ${text}\"}`
                            }]
                        })
                    })
                }
            }
        }, { quoted: m })

        return await conn.relayMessage(m.chat, msgs.message, {})
    } catch (e) {
        // Use m.reply to send a simpler error message

console.log(e)
m.reply(errorMessage)
    }
}

handler.help = ['gimage']
handler.tags = ['image']
handler.command = /^(gimage|image)$/i


module.exports = handler