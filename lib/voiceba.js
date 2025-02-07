const ws = require("ws");
/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @description Any Request? Send Form : https://docs.google.com/forms/d/1pjcUwKnQJ92gcxGMj3ZnbHcWGOj7INIglYnM0LMmspI
 * @author Kaviaann 2025
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
class BAVoice {
    constructor() { }
    async blueArchiveVoice(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let { text, model = "Airi", speed = 1.2 } = data;
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
            }
            catch (e) {
                return reject(`Error in voice ${data} ${e}`);
            }
        });
    }
    generateSession() {
        return Math.random().toString(36).substring(2);
    }
}

module.exports = BAVoice;
