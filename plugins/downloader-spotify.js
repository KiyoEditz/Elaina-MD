const { getInfo, spotifydl } = require("../lib/spotify");
const canvafy = require("canvafy");
let handler = async (m,{conn, text, usedPrefix, command}) => {
if (!text) throw `Masukan Link Spotify ‼️, *Example:* ${usedPrefix + command} https://open.spotify.com/tracks/xxxxxxxx`
    conn.sendMessage(m.chat, {
      react: {
        text: '🕒',
        key: m.key,
      }
    });
  try {
	let music = await spotifydl(text)

const info = await getInfo(text)

    let captionvid = `∘ Title: ${info.data.title}\n∘ Artist: ${info.data.artist.name}\n∘ ID: ${info.data.artist.id}\n\n${set.footer}`
const p = await new canvafy.Spotify()
            .setTitle(info.data.title)
            .setAuthor(htjava + " Spotify Downloader")
            .setTimestamp(40, 100)
            .setOverlayOpacity(0.8)
            .setBorder("#fff", 0.8)
            .setImage(info.data.thumbnail)
             .setBlur(3)
            .build();

       await conn.sendFile(m.chat, p, '', captionvid, m);
//conn.sendFile(m.chat, music.download, '', null, m, true)
    await conn.sendFile(m.chat, music.download, info.data.title + '.mp3', '', m, null, { asDocument: global.db.data.users[m.sender].useDocument});
} catch (e) {
    console.log(e)
    throw `Terjadi Kesalahan!\nCode: ${e}`
  }
}
handler.command = handler.help = ['spotify','spotifydl']
handler.tags = ['downloader']
module.exports = handler