let handler = async (m, { args, conn, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`Contoh penggunaan:\n${usedPrefix + command} https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F halo dunia`);
    }

    if (!args[0].startsWith("https://whatsapp.com/channel/")) {
        return m.reply("Link tautan tidak valid.");
    }

    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => {
        if (c === ' ') return '―';
        return hurufGaya[c] || c;
    }).join('');

    try {
        const link = args[0];
        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, emoji);

        return m.reply(`Berhasil mengirim reaction *${emoji}* ke pesan di channel *${res.name}*.`);
    } catch (e) {
        console.error(e);
        return m.reply("Gagal mengirim reaction. Pastikan link dan emoji valid.");
    }
};

handler.command = /^reactch$/i;
handler.tags = ['tools'];
handler.help = ['reactch <link> <pesan dalam huruf>'];

module.exports = handler;