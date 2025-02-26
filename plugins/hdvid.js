/**
  * Plugins CJS HDVID by DitzDev
  * Jangan apus WM Woi😂
  * Usahakan baca dulu sampe bawah, Jangan asal copas aja
  * source: https://whatsapp.com/channel/0029VaxCdVuFsn0eDKeiIm2c
  */
const fs = require('fs');
const { exec } = require('child_process');
const fetch = require('node-fetch');
const { remini } = require('../lib/hdvid.js');

let handler = async (m, { conn, text, usedPrefix, command }) => {
	const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        let fps = parseInt(text)
    if (!/video/.test(mime)) throw `Send/Reply videos with the caption *${usedPrefix}${command}* 60`;
    if ((m.quoted ? m.quoted.seconds : m.msg.seconds) > 30) throw `Maksimal video 30 detik!`
    if(!fps) throw `Masukkan fps, contoh: *${usedPrefix}${command}* 60`
    if(fps > 30) throw `Maksimal fps adalah 30 fps!`
    await conn.sendMessage(m.chat, { text: 'Wait... Executing the [ffmpeg] and [remini] libraries, This process may take 5-15 minutes' }, { quoted: m })

    const chdir = "tmp";
    const timestamp = Date.now();
    const pndir = `${chdir}/${m.sender}`;
    const rsdir = `${chdir}/result-${m.sender}`;
    const fdir = `${pndir}/frames/${timestamp}`;
    const rfdir = `${rsdir}/frames/${timestamp}`;
    const rname = `${rsdir}/${m.sender}-${timestamp}.mp4`;

    const dirs = [chdir, pndir, rsdir, `${pndir}/frames`, fdir, `${rsdir}/frames`, rfdir];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    });

    const media = await conn.downloadAndSaveMediaMessage(qmsg, `${pndir}/${timestamp}`);

    await new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${media} -vf "fps=${fps}" ${fdir}/frame-%04d.png`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const images = fs.readdirSync(fdir);
    let result = {};

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        result[image] = remini(fs.readFileSync(`${fdir}/${image}`), "enhance");
    }

    const values = await Promise.all(Object.values(result));
    Object.keys(result).forEach((key, index) => {
        result[key] = values[index];
    });
    
    for(let i of Object.keys(result)) {
    	fs.writeFileSync(`${rfdir}/${i}`, result[i]) 
    }

    await new Promise((resolve, reject) => {
        exec(`ffmpeg -framerate ${fps} -i ${rfdir}/frame-%04d.png -i ${media} -c:v libx264 -pix_fmt yuv420p -c:a aac -strict experimental -shortest ${rname}`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    conn.sendMessage(m.chat, { video: fs.readFileSync(rname) }, { quoted: m })
};

handler.help = ['hdvid'];
handler.command = ['hdvid'];
handler.tags = ['tools'];

module.exports = handler;