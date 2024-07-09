let handler = (m, { text, usedPrefix, command }) => {
    let teks = text || (m.quoted && m.quoted.text) || false;
    if (!teks) throw '_Masukkan teks!_\n\nContoh\n' + usedPrefix + command + ' ' + global.author;

    // Dictionary untuk konversi (dengan karakter yang diubah)
    const morseDict = {
        'a': '•–', 'b': '–•••', 'c': '–•–•', 'd': '–••', 'e': '•',
        'f': '••–•', 'g': '––•', 'h': '••••', 'i': '••', 'j': '•–––',
        'k': '–•–', 'l': '•–••', 'm': '––', 'n': '–•', 'o': '–––',
        'p': '•––•', 'q': '––•–', 'r': '•–•', 's': '•••', 't': '–',
        'u': '••–', 'v': '•••–', 'w': '•––', 'x': '–••–', 'y': '–•––',
        'z': '––••', '1': '•––––', '2': '••–––', '3': '•••––', '4': '••••–',
        '5': '•••••', '6': '–••••', '7': '––•••', '8': '–––••', '9': '––––•',
        '0': '–––––', ' ': '/' 
    };

    // Konversi setiap karakter ke Morse
    let morse = teks.toLowerCase().split('').map(char => {
        return morseDict[char] || char; // Jika karakter tidak ada di kamus, biarkan apa adanya
    }).join(' ');

    m.reply(`Kode morse:\n\n${morse}`);
};

handler.tags = ['fun', 'tools'];
handler.command = handler.help = ['morse'];
module.exports = handler;
