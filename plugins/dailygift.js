// let levelling = require('../lib/levelling')

// let handler = async (m, { conn, isPrems, isMods, command }) => {
//     let users = global.db.data.users[m.sender]
//     if (users.lastgift2) throw `Kamu sudah mengklaim klaim gift\nketik Keysip bagi yang belum claim`
//     users.exp += 5000
//     users.limit += 10
//     users.lastgift2 = true
//     m.reply(`+5000 XP \n10 Limit\nTerimakasih Semoga harimu menyenangkan`)
// }
// handler.customPrefix = /k/i
// handler.command = /^(eysip)$/i

// module.exports = handler

// function msToTime(duration) {
//     let seconds = Math.floor((duration / 1000) % 60)
//     let minutes = Math.floor((duration / (1000 * 60)) % 60)
//     let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

//     hours = (hours < 10) ? "0" + hours : hours
//     minutes = (minutes < 10) ? "0" + minutes : minutes
//     seconds = (seconds < 10) ? "0" + seconds : seconds

//     return hours + " jam " + minutes + " menit"
// }