let fs = require('fs')
const { exec } = require("child_process");
const cp = require("child_process");
const { promisify } = require("util");
let exec_ = promisify(exec).bind(cp);

let handler = m => m

handler.all = async function (m, { isOwner }) {
    if (m.isBaileys) return
    //if (m.fromMe) return
    if (m.chat.endsWith('broadcast')) return
    // Yang diblock ga direspon
    let setting = global.db.data.settings[this.user.jid]
    let chats = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]
    let { name, banned, registered } = user

    let teks2 = `${`Bot utama: @${global.conn.user.jid.split`@`[0]}`}\n\nInstagram Bot: https://instagram.com/lev_botwa`.trim()

    /*
    //////////////
    @Bot dipanggil
    ////////////// 
    */

    if (/^bot$/i.test(m.text)) {
        if (m.isGroup && chats.isBanned) return
        await this.reply(m.chat, `
Hai, ${ucap()} ${user.registered ? name : m.name} 
${banned ? '_*Kamu telah di banned/dilarang menggunakan bot!*_\n_Hubungi Owner untuk membuka banned_' : `Ada yg bisa dibantu?`}\n` + teks2, m)
        this.sendFile(m.chat, './src/vn/hyu.mp3', 'vn.mp3', null, m, true, {
            mimetype: 'audio/mp4',
            ephemeralExpiration: 86400
            // messageId: 'VNBOTJFHS875HF738FH73HU87EH7847H' || ''
        })
    }

    // 2

    if (/ bot |^bot | bot$/i.test(m.text) && !chats.isBanned) {
        if (!setting.autoresp) return
        this.respon = this.respon ? this.respon : {}
        if (m.chat in this.respon) {
            if (this.respon[m.chat].date > new Date() * 1 && this.respon[m.chat].date !== 0) return
            else this.respon[m.chat].bot += 1
            if (this.respon[m.chat].bot > 4) {
                this.respon[m.chat].date = new Date() * 1 + (86400000 / 4)
                return
            }
        } else this.respon[m.chat] = {
            bot: 0,
            date: 0
        }
        m.reply(this.pickRandom(['Iyaa.. Apa?', 'Hai, Bot disini', 'Saya terpanggil', 'Ciee manggil"', 'Apa sob?', 'Apa panggil" -_-', 'Bot bot bot bot tross', 'Kalau mau pakai, pakai aja.. Jngn pnggil" trus..', 'Piuuuu.... Dummmm... ', 'Tetetetetetete mantapu jiwaa']), m.chat, fakeImgReply)
    }

    /*
    //////////////
    @respon 
    //////////////
    */


    if (/audio/i.test(m.quoted && m.quoted.mimetype) && (m.quoted.seconds == 1) && m.quoted.isBaileys && m.quoted.fromMe) {
        m.reply(this.pickRandom(['Kenafahh🙄', 'Bagus ya suaraku :v', 'Aku masih bocil kaka 😶']), m.chat, fakeImgReply)
    }
    // salam

    if (/(ass?alam)/i.test(m.text)) {
        m.reply(`_Wa'alaikumsalam Wr. Wb._`, m.chat, fakeImgReply)
    }

    //hai

    if (/^(h(a?i|alo))$/i.test(m.text) && !m.quoted) {
        m.reply(`Hai *${registered ? name : await conn.getName(m.sender, { withoutContact: true })}, _${ucap()}_*!`.trim())
    }

    //sepi

    if (/^sepi/i.test(m.text)) {
        m.reply('Ramein lah ka', m.chat, fakeImgReply)
    }

    // di tag
    if (setting.antitag) {
        if (m.mentionedJid && m.mentionedJid.includes(db.data.settings[this.user.jid].owner || (owner[2] + '@s.whatsapp.net')) && !chats.isBanned) m.reply(`Kenapa ngetag" ownerku _-`)
    }
    /* 
    //////////////
    @respon vn
    //////////////
    */

    if (/^ara.ara$/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/araara.opus', 'suara.opus', null, m, true, {
            ephemeralExpiration: 86400
        })
    }
    if (/^yamete/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/yamete.opus', 'suara.opus', null, m, true, {
            ephemeralExpiration: 86400
        })
    }
    if (/^baka/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/bakasong.mp3', 'bakasong.mp3', null, m, true, {
            mimetype: 'audio/mp4',
            ephemeralExpiration: 86400
        })
    }
    if (/chan/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/onichan_1.oga', 'yaa.opus', null, m, true, {
            ephemeralExpiration: 86400
        })
    }
    if (/^dame$/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/dame.mp3', 'suara.opus', null, m, true, {
            ephemeralExpiration: 86400
        })
    }
    if (/^rawr$/i.test(m.text)) {
        this.sendFile(m.chat, './src/vn/rawr.opus', 'suara.opus', null, m, true, {
            ephemeralExpiration: 86400
        })
    }
    ///////// Private chat //////////

    if (!m.isGroup) {
        /*
            @First chat
            */
        if ((/[a-z]/i.test(m.text))) {
            if (m.fromMe) {
                chats.pc = new Date * 1
                return
            } let chatSender = global.db.data.chats[m.sender]
            if (new Date - global.db.data.chats[m.sender].pc < 43200000) return

            chatSender.pc = new Date * 1
            chatSender.faham = true
            let isinit = chatSender.fahan
            let init = [
                `Hai, ${ucap()} 
            ${banned ? '_*Kamu telah di banned/dilarang menggunakan bot!*_\n_Hubungi Owner untuk membuka banned_' : ``}`,
                'Silahkan gunakan Bot dengan sebaik mungkin\nDilarang spam, telfon, ddos\nJika ada yang ditanyakan silahkan hubungi Owner' + `\n\n${teks2}`,
                'Menu', '.menu', 'Link Group Bot', `.group`, 'Owner', '.owner']

            let notInit = [`Hai, Selamat Datang! 😁\n\nAku adalah *Bot Whatsapp* yang siap membantu kamu😅\n\nTerimakasih telah menghubungi *Bot: ${conn.user.name}*`,
                `Sejauh apa kamu tahu tentang Bot ? \n\n__________`,
                'Sudah faham', '.sayasudahfaham', 'Apa itu Bot?', '.help']

            let or = chatSender.faham ? init : notInit
            conn.reply(m.chat, or[0].trim() + ' \n\n ' + or[1].trim(), m, { contextInfo: { mentionedJid: conn.parseMention(teks2) } })
        }

        // ketika ada yang invite/kirim link grup di chat pribadi

        if (((this.user.jid == global.conn.user.jid) && m.mtype === 'groupInviteMessage' || m.text.includes('https://chat') || m.text.startsWith('Buka tautan ini')) && !m.isBaileys && !m.isGroup && !isOwner) {
            this.reply(m.chat, `╔═〘 Invite Bot ke Grup 〙
║ *Harga Sewa Bot* :
╟ Rp. 10.000 / bulan
╟ ( Qris-Dana-GO-Pay-Shoopepay )
╟ Khusus Via pulsa Rp. 15.000
║
╟ Hubungi Owner
╚════
`.trim(), m, { contextInfo: { mentionedJid: [global.owner[2] + '@s.whatsapp.net'] } })
        }
    }

    /*
    /////////////
    @System 
    //////////////////
    */
    if (setting.autoreact) {
        if (m.text.length > 25) this.sendMessage(m.chat, {
            react: {
                text: this.pickRandom(['🌷', '🏵️', '🌠', '🐱', '🦄', '🐬', '🐥', '🐠', '⛲', '🏝️']),
                key: m.key
            }
        })
    }
    // backup db
    // if (new Date() * 1 - setting.status > 1000) {
    //     let _uptime = process.uptime() * 1000
    //     let uptime = clockString(_uptime)
    //     await this.setStatus(`Bot berjalan selama ${uptime}`).catch(_ => _)
    //     setting.status = new Date() * 1
    // }

    if (setting.backup) {
        if (new Date() * 1 - setting.backupDB > 1000 * 60 * 60) {
            setting.backupDB = new Date() * 1
            let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            conn.reply(global.owner[0] + '@s.whatsapp.net', `Database: ${date}`, null)
            conn.sendFile(global.owner[0] + '@s.whatsapp.net', fs.readFileSync('./database.json'), 'database.json', '', false, false, { mimetype: 'application/json' })
        }
    }
     if (setting.backupsc) {
        if (new Date() * 1 - setting.backupSc > 1000 * 60 * 60) {
            setting.backupSc = new Date() * 1
            let d = new Date
            let dates = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            conn.reply(global.owner[0] + '@s.whatsapp.net', `BackupSc: ${dates}`, null)
      let zipFileName = `BackupScript.zip`;
     
         const file = fs.readFileSync('./BackupScript.zip');
         conn.sendMessage(
            global.owner[0] + '@s.whatsapp.net',
            {
               document: file,
               mimetype: "application/zip",
               fileName: zipFileName,
               caption: "Backup selesai. Silakan unduh file backup.",
            },
            { quoted: m }
         );

         setTimeout(() => {
            fs.unlinkSync(zipFileName);
            conn.reply(global.owner[0] + '@s.whatsapp.net', `File backup telah dihapus.`);
      }, 3000);

      setTimeout(() => {
         let zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;
         exec_(zipCommand, (err, stdout) => {
         });
      }, 1000);
        }
    }
}

module.exports = handler
