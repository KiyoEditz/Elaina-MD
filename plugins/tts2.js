const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (command == 'tts2') {
        if (!text) throw `Contoh: ${usedPrefix + command} anak berlari menggunakan pakaian merah 3d animation`;
        try {
            m.reply(wait)
            let response = await fetch('https://api.play.ht/api/v2/tts', {
                method: 'POST',
                headers: {
                    accept: 'text/event-stream',
                    'content-type': 'application/json',
                    AUTHORIZATION: 'd90ced3ede134f8fbd6980451d8a531e',
                    'X-USER-ID': 'bDY64XTOGWYx3o2utszUCqPJG2D2'
                },
                body: JSON.stringify({
                    text: `${text}`,
                    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
                    output_format: 'mp3',
                    voice_engine: 'PlayHT2.0'
                })
            })
                .then(res => res.json());

            for (let i = 0; i < 4; i++) {
                let img = response.result[i]
                await sleep(3000)
                await conn.sendFile(m.chat, img, 'tts.opus', null, m, true);
            }
        } catch (error) {
            throw `Error: ${error}`
        }
    }
}

handler.command = handler.help = ['tts2']
handler.tags = ['tools']
handler.limit = true

module.exports = handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}