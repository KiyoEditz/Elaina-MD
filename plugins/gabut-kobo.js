const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let handler = async (m, { conn }) => {
    let loadd = [
        "Beli Ciki",
        "Beli Koyo",
        "Sukiyo!!..",
        "Ima anata ni omoi nosete",
        "Hora, sunao ni naru no Watashi!!..",
        "Kono Saki Moto soba ni ite mo ii ka na?",
        "Koi to koi ga kasanatte!!",
        "Sukiyo!!.."
    ];

   // Array untuk menyimpan delay masing-masing tahap loading dalam milidetik
   let delays = [
    0.12 * 1000,  // 120 ms
    0.12 * 1000,  // 120 ms
    0.12 * 1000,  // 120 ms
    0.15 * 1000,  // 150 ms
    0.15 * 1000,  // 150 ms
    0.14 * 1000,  // 140 ms
    0.13 * 1000,  // 130 ms
    0.14 * 1000   // 140 ms
];

   // Mengirim pesan loading awal
   let { key } = await conn.sendMessage(m.chat, { text: 'ʟ ᴏ ᴀ ᴅ ɪ ɴ ɢ. . .' }); // Pengalih isu

   // Mengedit pesan dengan status loading
   for (let i = 0; i < loadd.length; i++) {
    await delay(delays[i % delays.length]);
    await conn.sendMessage(m.chat, { text: loadd[i], edit: key });
}
};



handler.help = ['loading'];
handler.tags = ['fun'];
handler.command = /^(loading)$/i;

module.exports = handler;