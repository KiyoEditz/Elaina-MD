let handler = async (m, { text, usedPrefix, command }) => {
if (!text) throw "*Ketik nama lu!.. 😛*"
    
     const khodam = ['Kaleng Cat Avian',
	  'Pipa Rucika',
	  'Botol Tupperware',
	  'Badut Mixue',
	  'Sabun GIV',
	  'Sandal Swallow',
	  'Jarjit',
	  'Ijat',
	  'Fizi',
	  'Mail',
	  'Ehsan',
	  'Upin',
	  'Ipin',
	  'sungut lele',
	  'Tok Dalang',
	  'Opah',
	  'Alul',
	  'Pak Vinsen',
	  'Maman Resing',
	  'Pak RT',
	  'Admin ETI',
	  'Bung Towel',
	  'Lumpia Basah',
	  'Martabak Manis',
	  'Baso Tahu',
	  'Tahu Gejrot',
	  'Dimsum',
	  'Seblak Ceker',
	  'Telor Gulung',
	  'Tahu Aci',
	  'Tempe Mendoan',
	  'Nasi Kucing',
	  'Kue Cubit',
	  'Tahu Sumedang',
	  'Nasi Uduk',
	  'Wedang Ronde',
	  'Kerupuk Udang',
	  'Cilok',
	  'Cilung',
	  'Kue Sus',
	  'Jasuke',
	  'Seblak Makaroni',
	  'Sate Padang',
	  'Sayur Asem',
	  'Kromboloni',
	  'Marmut Pink',
	  'Belalang Mullet',
	  'Kucing Oren',
	  'Lintah Terbang',
	  'Singa Paddle Pop',
	  'Macan Cisewu',
	  'Vario Mber',
	  'Beat Mber',
	  'Supra Geter',
	  'Oli Samping',
	  'Knalpot Racing',
	  'Jus Stroberi',
	  'Jus Alpukat',
	  'Alpukat Kocok',
	  'Es Kopyor',
	  'Es Jeruk',
	  'Cappucino Cincau',
	  'Jasjus Melon',
	  'Teajus Apel',
	  'Pop ice Mangga',
	  'Teajus Gulabatu',
	  'Air Selokan',
	  'Air Kobokan',
	  'TV Tabung',
	  'Keran Air',
	  'Tutup Panci',
	  'Kotak Amal',
	  'Tutup Termos',
	  'Tutup Botol',
	  'Kresek Item',
	  'Kepala Casan',
	  'Ban Serep',
	  'Kursi Lipat',
	  'Kursi Goyang',
	  'Kulit Pisang',
	  'Warung Madura',
	  'Gorong-gorong',
     'Ikan lele',
     'Toren air',
     'PVC-Paralon'
	];
    const rkhodam= await getRandomItem(khodam);
  conn.reply(m.chat,`
╭━━━━°「 *Cekkodam* 」°
┃
┊• *Nama :* ${text}
┃• *Khodam :* ${rkhodam}
╰═┅═━––––––๑
	  `,m);
  }
handler.command = handler.help = ['cekkhodam'];
handler.tags = ['fun'];
handler.premium = false;
module.exports = handler;

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}