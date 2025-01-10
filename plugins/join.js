/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Bot - Join Group (bgi yg belum punya aja)
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return m.reply('Masukkan link undangan grup.');
    }
    const link = args[0].trim();
    const regexLink = /^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]{10,})$/;
    const linkMatch = link.match(regexLink);
    
    if (!linkMatch) {
        return m.reply('Harap isi atau masukkan link yang valid.');
    }

    const inviteCode = linkMatch[1];
    try {
        await conn.groupAcceptInvite(inviteCode);
        m.reply('✅ Berhasil bergabung ke grup!');
    } catch (err) {
        console.error(err);
        m.reply('Gagal join, mungkin bot dikeluarkan dari grup oleh admin.');
    }
};

handler.help = ['join'];
handler.tags = ['group'];
handler.command = /^join$/i;
handler.owner = true;

module.exports = handler;