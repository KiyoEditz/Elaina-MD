let handler = (m, { text, usedPrefix, command }) => {
    let teks = text || (m.quoted && m.quoted.text) || false;
    if (!teks) throw '_Masukkan teks!_\n\nContoh\n' + usedPrefix + command + ' ' + global.author;
    let morse = teks.replace(/[a-zA-Z0-9]/g, v => {
        switch (v.toLowerCase()) {
            case 'a': return '•–';
            case 'b': return '–•••';
            case 'c': return '–•–•';
            case 'd': return '–••';
            case 'e': return '•';
            case 'f': return '••–•';
            case 'g': return '––•';
            case 'h': return '••••';
            case 'i': return '••';
            case 'j': return '•–––';
            case 'k': return '–•–';
            case 'l': return '•–••';
            case 'm': return '––';
            case 'n': return '–•';
            case 'o': return '–––';
            case 'p': return '•––•';
            case 'q': return '––•–';
            case 'r': return '•–•';
            case 's': return '•••';
            case 't': return '–';
            case 'u': return '••–';
            case 'v': return '•••–';
            case 'w': return '•––';
            case 'x': return '–••–';
            case 'y': return '–•––';
            case 'z': return '––••';
            case '1': return '•––––';
            case '2': return '••–––';
            case '3': return '•••––';
            case '4': return '••••–';
            case '5': return '•••••';
            case '6': return '–••••';
            case '7': return '––•••';
            case '8': return '–––••';
            case '9': return '––––•';
            case '0': return '–––––';
            default: return v;
        }
    });
    m.reply(`Kode morse:\n\n*${morse}*`);
};
handler.tags = ['fun', 'tools'];
handler.command = handler.help = ['morse'];
module.exports = handler;
