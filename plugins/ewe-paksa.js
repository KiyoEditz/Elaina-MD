let handler = async (m, { conn }) => {
    let users = m.mentionedJid[0];
    if (!users) {
        conn.reply(m.chat, `Tag pengguna yang ingin ditarget!`, m);
        return;
    }

    let name = global.db.data.users[users]?.name || 'Pengguna';
    let user = global.db.data.users[m.sender];
    let id = m.sender;
    let kerja = 'ewe-paksa';
    conn.misi = conn.misi ? conn.misi : {};

    if (id in conn.misi) {
        conn.reply(m.chat, `Selesaikan Misi ${conn.misi[id][0]} Terlebih Dahulu`, m);
        throw false;
    }

    let randomaku1 = Math.floor(Math.random() * 1000000);
    let randomaku2 = Math.floor(Math.random() * 10000);

    let dimas = `
👙 kamu paksa
     dia buka baju😋
`.trim();

    let dimas2 = `
🥵💦 sszz Ahhhh.....
`.trim();

    let dimas3 = `
🥵Ahhhh, Sakitttt!! >////<
 💦Crotttt.....
  💦Crottt lagi
`.trim();

    let dimas4 = `
🥵💦💦Ahhhhhh😫
`.trim();

    let hsl = `
*—[ Hasil Ewe Paksa ${name} ]—*
➕ 💹 Uang = [ ${randomaku1} ]
➕ ✨ Exp = [ ${randomaku2} ]
`.trim();

    user.exp += randomaku2;

    conn.misi[id] = [
        kerja,
        setTimeout(() => {
            delete conn.misi[id];
        }, 27000)
    ];

    setTimeout(() => {
        m.reply(hsl);
    }, 27000);

    setTimeout(() => {
        m.reply(dimas4);
    }, 25000);

    setTimeout(() => {
        m.reply(dimas3);
    }, 20000);

    setTimeout(() => {
        m.reply(dimas2);
    }, 15000);

    setTimeout(() => {
        m.reply(dimas);
    }, 10000);

    setTimeout(() => {
        m.reply('😋mulai ewe paksa..');
    }, 0);

    user.lastmisi = new Date * 1;
};

handler.help = ['ewe-paksa @tag'];
handler.tags = ['premium', 'fun'];
handler.command = /^(ewe-paksa)$/i;
handler.group = true;

module.exports = handler;
