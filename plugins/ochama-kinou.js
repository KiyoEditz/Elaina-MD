let handler = async (m, { conn }) => {

    // Pesan-pesan yang akan ditampilkan dalam urutan tertentu
    let messages = [
        "Itsudemo i love you",
        "Kimi ni take kiss me",
        "Wasurerarenai kara",
        "Boku no daijina memorii",
        "Dorayaki wa",
        "Shushoku ni narenai",
        "Naraba uwagaki shichaeba",
        "Boku no omoidoori"
    ];

    // Mengirim pesan pertama untuk mendapatkan `key`
    let { key } = await conn.sendMessage(m.chat, { text: messages[0] });

    // Mengatur waktu interval untuk setiap pesan
    let timeIntervals = [0, 1200, 2100, 3000, 4200, 4800, 5700, 6600];
    for (let i = 1; i < messages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, timeIntervals[i]));
        await conn.sendMessage(m.chat, { text: messages[i], edit: key });
    }
};

handler.help = ['ochama kinou'];
handler.tags = ['main'];
handler.command = /^(ochama-kinou)$/i;

module.exports = handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}