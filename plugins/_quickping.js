
let speed = require('performance-now')
let { spawn, exec, execSync } = require('child_process')

let handler = async (m, { conn }) => {
         conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
         let timestamp = speed();
         let latensi = speed() - timestamp;
         exec(`neofetch --stdout`, (error, stdout, stderr) => {
          let child = stdout.toString("utf-8");
          let ssd = child.replace(/Memory:/, "Ram:");
          conn.reply(m.chat, `${ssd} _汉  Kecepatan : ${latensi.toFixed(4)} ms_`, m);
            });
}
handler.command = ['']

module.exports = handler
