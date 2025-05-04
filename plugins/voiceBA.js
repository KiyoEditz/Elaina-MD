const translate = require('translate-google-api');
const ws = require("ws");
let handler = async (m, { conn, usedPrefix, args, command, text }) => {
class BlueArchive {
        voice = async function voice(text, model = "Airi", speed = 1.2) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (!text || text.length >= 500)
                        throw new Error(`Make sure to enter valid text, that's not exceed 500 words!`);
                    if (speed && (speed < 0.1 || speed > 2))
                        speed = 2;
                    model = "JP_" + model;
                    const base_url = "https://ori-muchim-bluearchivetts.hf.space/";
                    const session_hash = this.generateSession();
                    const socket = new ws("wss://ori-muchim-bluearchivetts.hf.space/queue/join");
                    socket.on("message", (data) => {
                        const d = JSON.parse(data.toString("utf8"));
                        switch (d.msg) {
                            case "send_hash": {
                                socket.send(JSON.stringify({
                                    fn_index: 0,
                                    session_hash,
                                }));
                                break;
                            }
                            case "send_data": {
                                socket.send(JSON.stringify({
                                    fn_index: 0,
                                    session_hash,
                                    data: [text, model, speed],
                                }));
                                break;
                            }
                            case "estimation":
                            case "process_starts": {
                                break;
                            }
                            case "process_completed": {
                                const o = d.output;
                                const name = o.data[1]?.name;
                                socket.close();
                                return resolve({
                                    text,
                                    model: model,
                                    speed,
                                    result: {
                                        duration: +o.duration.toFixed(2),
                                        path: name,
                                        url: base_url + "file=" + name,
                                    },
                                });
                            }
                            default: {
                                console.log(`Unexpected message type : ${data.toString("utf8")}`);
                                break;
                            }
                        }
                    });
                } catch (e) {
                    return reject(`Error in voice process: ${e.message}`);
                }
            });
        }
        generateSession = function generateSession() {
            return Math.random().toString(36).substring(2);
        }
    }
    try {
        let [teks, char, sped] = text.split('|')
        if (!teks || !char) return m.reply('> Example: .ttsba jawa|momoi')
        const suppVoice = ['airi', 'akane', 'akari', 'ako', 'aris', 'arona', 'aru', 'asuna', 'atsuko', 'ayane', 'azusa', 'cherino', 'chihiro', 'chinatsu', 'chise', 'eimi', 'erica', 'fubuki', 'fuuka', 'hanae', 'hanako', 'hare', 'haruka', 'haruna', 'hasumi', 'hibiki', 'hihumi', 'himari', 'hina', 'hinata', 'hiyori', 'hoshino', 'iori', 'iroha', 'izumi', 'izuna', 'juri', 'kaede', 'karin', 'kayoko', 'kazusa', 'kirino', 'koharu', 'kokona', 'kotama', 'kotori', 'main', 'maki', 'mari', 'marina', 'mashiro', 'michiru', 'midori', 'miku', 'mimori', 'misaki', 'miyako', 'miyu', 'moe', 'momoi', 'momoka', 'mutsuki', 'NP0013', 'natsu', 'neru', 'noa', 'nodoka', 'nonomi', 'pina', 'rin', 'saki', 'saori', 'saya', 'sena', 'serika', 'serina', 'shigure', 'shimiko', 'shiroko', 'shizuko', 'shun', 'ShunBaby', 'sora', 'sumire', 'suzumi', 'tomoe', 'tsubaki', 'tsurugi', 'ui', 'utaha', 'wakamo', 'yoshimi', 'yuuka', 'yuzu', 'zunko']
        if (!suppVoice.includes(char)) {
            const txtVoice = suppVoice.map(name => name.charAt(0).toUpperCase() + name.slice(1)).sort().map(name => `> - ${name}`).join('\n');
            m.reply(
`*Char tidak ditemukan!*
Berikut list char yang disupport:
${txtVoice}`
            )
            return
        }
        m.reply("Wait....")
        const pedo = new BlueArchive()
        const translated = await translate(teks, { to: 'ja', autoCorrect: false })
        let charr = char.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const ba = await pedo.voice(translated[0], charr, sped || 1)
        conn.sendMessage(m.chat, { audio: { url: ba.result.url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
    } catch (err) {
        console.error(err);
        m.reply('> Yahh, error...')
    }
}
handler.help = ['ttsba']
handler.tags = ['audio']
handler.command = /^(ttsba)$/i
handler.limit = true
handler.register = true
module.exports = handler;