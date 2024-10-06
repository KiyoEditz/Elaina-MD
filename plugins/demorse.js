let handler = (m, { text, usedPrefix, command }) => {
    let morse = text || (m.quoted && m.quoted.text) || false;
    if (!morse) throw '_Masukkan kode morse!_\n\nContoh\n' + usedPrefix + command + ' •– / –••• / –•–• / –•• / •';

    // Dictionary Morse to Text
    const morseDict = {
        '•–': 'a', '–•••': 'b', '–•–•': 'c', '–••': 'd', '•': 'e',
        '••–•': 'f', '––•': 'g', '••••': 'h', '••': 'i', '•–––': 'j',
        '–•–': 'k', '•–••': 'l', '––': 'm', '–•': 'n', '–––': 'o',
        '•––•': 'p', '––•–': 'q', '•–•': 'r', '•••': 's', '–': 't',
        '••–': 'u', '•••–': 'v', '•––': 'w', '–••–': 'x', '–•––': 'y',
        '––••': 'z', '•––––': '1', '••–––': '2', '•••––': '3', '••••–': '4',
        '•••••': '5', '–••••': '6', '––•••': '7', '–––••': '8', '––––•': '9',
        '–––––': '0', '/': ' '
    };

    // Split kode Morse berdasarkan spasi atau '/'
    let morseWords = morse.split(/\/|\s/);

    // Konversi setiap kata dalam Morse
    let teks = morseWords.map(word => {
        return word.split(' ').map(char => morseDict[char] || char).join(''); 
    }).join(' ');

    m.reply(`Teks hasil konversi:\n\n${teks}`);
};

handler.tags = ['fun', 'tools'];
handler.command = handler.help = ['dmorse','demorse']; // Mengubah command name
module.exports = handler;