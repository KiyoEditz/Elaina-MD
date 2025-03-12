const handler = async (m, { conn }) => {
  const chatID = m.chat;
  const onlineMembers = [];

  const members = await conn.groupMetadata(chatID);
  for (const member of members.participants) {
    console.log('Member:', member);
    if (member.id && member.id && conn.user.jid && member.id.includes('@s.whatsapp.net')) {
      onlineMembers.push(`│ ○ Name: ${conn.getName(member.id.split(`@`)[0] + `@s.whatsapp.net`)}\n│ wa.me/${member.id.split('@')[0]}`);
    }
  }

  if (onlineMembers.length > 0) {
    const onlineList = onlineMembers.join('\n');
    conn.reply(m.chat, `╭───「 *LIST•ONLINE* 」───⬣\n│ *Anak haram yang cuman nyimak* \n│\n${onlineList}\n╰──── •`, m, {
    contextInfo: { mentionedJid: members.participants }
  });
  } else {
    m.reply('Tidak ada anggota yang sedang online.');
  }
};

handler.help = ['here', 'listonline']
handler.tags = ['group']
handler.command = /^(here|(list)?online)$/i
handler.group = true
handler.admin = true
handler.limit = true

module.exports = handler