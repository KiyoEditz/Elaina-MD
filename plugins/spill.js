let handler = async (m, { conn }) => {
  conn.reply(m.chat, `“${conn.pickRandom(global.spill)}”`, m)
}
handler.help = ['spill']
handler.tags = ['fun']
handler.command = /^spill$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
global.spill = [
  "Spill stiker favorit",
  "spill salah satu nama panggilan dari sahabat",
  "spill orang yang paling polos?",
  "BAGAIMANA PERASAANMU KETIKA KAMU NGECHAT DIREAD DOANG",
  "pernah nge stuck di 1 orang ga?",
  "spill yang paling pinter",
  "spill kang ghosting",
  "Spill yang kamu doakan di sepertiga malammu",
  "spill yang sering jadi korban fakboy",
  "Spill orang yang bikin kamu terkesima setiap saat",
  "spill yg paling baby face",
  "Spill temen yg fake friend (tag lahhh)",
  "Spill moodbooster lu. Tag akunnya!",
  "Spill orang yang lo kode kode tapi nggak peka peka",
  "spill yg kaya monyet",
  "spill orang paling dongo",
  "Spill mantan terlama",
  "Spill pernah gak sukak sama teman sendiri",
  "spill yang sering berantem/ribut sama cp",
  "Spill yang suka halu",
  "spill yg sering lupa balas chat",
  "Spill siapa yang rusuh",
  "Spill kata kasar yg sering dipake",
  "Spill lagu yang pernah bikin nangis",
  "spill orang yg pengen lo santet",
  "spill yang bikin lu susah move on",
  "spill tugas yang pernah ga dikerjain",
  "Spill keinginan lo di tahun depan",
  "Spill ditikung or menikung?",
  "Spill nama bapak",
  "Spill orang yang tidak kamu sukai",
  "SPILL OR DRINK (RL):",
  "Spill barang yang di kasih doi",
  "Spill lagu indo fav",
  "spill temen lu yang cabe !",
  "Spill temen yang suka buat dosa",
  "Spill org yg paling lu gak bisa lupain",
  "Spill guru tergalak pas sd",
  "Spill yg pernah jadi ttm lu",
  "Spill yg sering nyuekin km",
  "Spill sifat cowo/cewe yg lu gasuka",
  "spill yg sering nangis gegara cowo",
  "Diduain atau ngeduain?"
]