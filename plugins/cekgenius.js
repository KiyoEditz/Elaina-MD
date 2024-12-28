/*
*
* [ *FEATURE CEKGENIUS* ]
* Created By Hann
* 
* Saluran: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
**/

const { createCanvas } = require('canvas');

const handler = async (m, { text, conn }) => {
  let korban = m.mentionedJid[0];
  if (!korban) return m.reply(`*Contoh :* .cekgenius Axel`);
  let name = global.db.data.users[korban]?.name || 'anak kontol gak register';
  function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
  }

  function wrapText(text, maxLength) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
      if (currentLine.length + word.length < maxLength) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine);
        currentLine = word + ' ';
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  function getDescriptionByLevel(level) {
    if (level <= 5) return 'Baru mulai berkembang.';
    if (level <= 15) return 'Potensimu terlihat.';
    if (level <= 25) return 'Pemikiranmu tajam.';
    if (level <= 35) return 'Kecerdasan berkembang pesat.';
    if (level <= 45) return 'Semakin bijaksana.';
    if (level <= 55) return 'Hampir puncak, inovatif.';
    if (level <= 65) return 'Pemikir luar biasa.';
    if (level <= 75) return 'Mampu memecahkan masalah kompleks.';
    if (level <= 85) return 'Menuju kesempurnaan.';
    if (level <= 95) return 'Mendekati sempurna.';
    if (level === 100) return 'Jenius sejati, sempurna!';
    return 'Deskripsi tidak tersedia';
  }

  const geniusLevels = [
    'Kecerdasan Level : 4%\n\nBaru mulai berkembang.',
    'Kecerdasan Level : 7%\n\nPotensimu terlihat.',
    'Kecerdasan Level : 12%\n\nPemikiranmu tajam.',
    'Kecerdasan Level : 22%\n\nKecerdasan berkembang pesat.',
    'Kecerdasan Level : 27%\n\nSemakin bijaksana.',
    'Kecerdasan Level : 35%\n\nHampir puncak, inovatif.',
    'Kecerdasan Level : 41%\n\nPemikir luar biasa.',
    'Kecerdasan Level : 48%\n\nMampu memecahkan masalah kompleks.',
    'Kecerdasan Level : 56%\n\nMenuju kesempurnaan.',
    'Kecerdasan Level : 64%\n\nMendekati sempurna.',
    'Kecerdasan Level : 71%\n\nJenius sejati.',
    'Kecerdasan Level : 77%\n\nTak terkalahkan.',
    'Kecerdasan Level : 83%\n\nMengubah dunia.',
    'Kecerdasan Level : 90%\n\nKecerdasan luar biasa.',
    'Kecerdasan Level : 95%\n\nTak terhentikan.',
    'Kecerdasan Level : 100%\n\nJenius sejati, sempurna!'
  ];

  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const canvas = createCanvas(637, 400);
  const ctx = canvas.getContext('2d');
  const colors = ['#1E90FF', '#4682B4', '#5F9EA0', '#00BFFF', '#87CEEB'];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Poppins", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 6;
  ctx.fillText('HASIL PENGECEKAN GENIUS', canvas.width / 2, 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px "Lora", serif';
  ctx.fillText(name, canvas.width / 2, 120);

  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(50, 180, 537, 20);

  const randomGenius = pickRandom(geniusLevels);
  const levelMatch = randomGenius.match(/Kecerdasan Level : (\d+)%/);

  if (!levelMatch) {
    return m.reply('⚠️ Terjadi kesalahan dalam mendapatkan level kecerdasan!');
  }

  const level = parseInt(levelMatch[1]);
  const progressWidth = (537 * level) / 100;

  const progressGradient = ctx.createLinearGradient(50, 180, 587, 180);
  progressGradient.addColorStop(0, '#1E90FF');
  progressGradient.addColorStop(1, '#87CEEB');
  ctx.fillStyle = progressGradient;
  ctx.fillRect(50, 180, progressWidth, 20);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Open Sans", sans-serif';
  ctx.fillText(`${level}%`, 170, 195);

  const description = getDescriptionByLevel(level);
  const lines = wrapText(description, 80);

  let textY = 230;
  if (lines.length > 3) {
    textY = 280;
  }

  ctx.fillStyle = '#FFD700'; 
  ctx.font = 'bold 18px "Poppins", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 4; 
  ctx.strokeStyle = '#FF4500'; 
  lines.forEach((line, index) => {
    const lineY = textY + (index * 25); 
    ctx.strokeText(line, canvas.width / 2, lineY);
    ctx.fillText(line, canvas.width / 2, lineY);
  });

  const buffer = canvas.toBuffer();
  conn.sendFile(m.chat, buffer, 'genius.png', 'Ini adalah hasil cek kecerdasanmu!', m);
};

handler.command = ['cekgenius'];
handler.tags = ['tools','fun'];
handler.help = ['cekgenius <nama>'];

module.exports = handler;