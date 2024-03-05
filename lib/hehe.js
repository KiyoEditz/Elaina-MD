>> let { toAudio } = require('../lib/converter')

let send = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {

    let type = await conn.getFile(path, true)

    let { res, data: file, filename: pathFile } = type
    if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) } }
        catch (e) { if (e.json) throw e.json }
    }
    let opt = {}
    if (quoted) opt.quoted = quoted
    if (!type) options.asDocument = true
    let mtype = '', mimetype = options.mimetype || type.mime, convert
    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
    else if (/audio/.test(type.mime) || (/video/i.test(type.mime) && options.asAudio)) {

        convert = await toAudio(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = options.mimetype || 'audio/mpeg'
    }
    else if (/video/.test(type.mime)) mtype = 'video'
    else mtype = options.mimetype || 'document'
    if (options.asDocument) mtype = 'document'

    delete options.asSticker
    delete options.asLocation
    delete options.asVideo
    delete options.asDocument
    delete options.asImage

    let message = {
        ...options,
        caption,
        ptt,
        [mtype]: { url: pathFile },
        mimetype,
        fileName: filename || pathFile.split('/').pop()
    }
    /**
     * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo}
     */
    let m
    try {
        m = await conn.sendMessage(jid, message, { ...opt, ...options })
    } catch (e) {
        console.error(e)
        m = null
    } finally {
        if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
        file = null // releasing the memory
        return m
    }
}

return send(m.chat, await m.quoted.download(), 'to.mp3', '', m, null, { asAudio: true })