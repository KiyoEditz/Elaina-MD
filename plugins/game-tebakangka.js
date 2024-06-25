let handler = async (m, { conn, command, text, args }) => {
  if (args.length === 0) return conn.reply(m.chat, 'Harap masukan pilihan angkamu antara 0 dan 9', m);

  const userChoice = parseInt(args[0]);
  if (isNaN(userChoice) || userChoice < 0 || userChoice > 9) {
      return conn.reply(m.chat, 'Pilih Angka 0 sampai 9!', m);
  }

  const botChoice = pickRandom([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const bonus = Math.floor(Math.random() * 3000); 

  let message = `*「 TEBAK ANGKA 」*\n\n`;
  message += `Angka Kamu: ${userChoice}\n`;
  message += `Angka Bot: ${botChoice}\n\n`;

  if (userChoice === botChoice) {
      message += `🎉 Selamat! Angkamu sama dengan bot.\n`;
      global.db.data.users[m.sender].exp += bonus; 
  } else {
      message += `❌ Sayang sekali, angkamu tidak sama dengan bot.\n`;
  }

  message += `+${bonus} XP!`; 
  conn.reply(m.chat, message.trim(), m);
};

handler.help = ['tebakangka <0-9>'];
handler.tags = ['game'];
handler.command = /^tebakangka|angka$/i; 

handler.tigame = true;
handler.group = true;
handler.game = true;
handler.fail = null;

module.exports = handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
