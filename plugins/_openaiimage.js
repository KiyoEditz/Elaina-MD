const axios = require('axios');
var handler = async (m, { conn, usedPrefix, command, text }) => {
try {
            if (!text) return m.reply(`Chat dengan AI.\n\nContoh:\n${usedPrefix}${command} Apa itu resesi`);
            conn.reply(`_*Tunggu sedang diproses...*_`);
            const data = await(await axios.get('https://widipe.com/dalle?text=' + text, {responseType:'arraybuffer'})).data
         return conn.sendFile(m.chat, data, '', `Result From : ${text}`, m) 
          } catch (error) {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error :"+ error);
          }
        }
handler.help = ['dalle']
handler.tags = ['tools','ai']
handler.limit = true
handler.exp = 0;
handler.command = /^(dalle)$/i 

module.exports = handler;