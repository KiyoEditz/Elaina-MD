let handler = m => m

let levelling = require('../lib/levelling')
handler.before = function (m) {
        let user = global.db.data.users[m.sender]
        if (!user.autolevelup) return !0
        let before = user.level * 1
        while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
        if (before !== user.level) {
                this.reply(m.chat, `
Selamat, anda telah naik level!
*${before}* -> *${user.level}*
Reward: Claim lebih banyak XP Harian seiring naiknya level 
Role kamu sekarang: *${user.role}*      
Ketik *.role* untuk melihat role
gunakan *.cek* untuk mengecek`.trim(), m)

        }
}

module.exports = handler
