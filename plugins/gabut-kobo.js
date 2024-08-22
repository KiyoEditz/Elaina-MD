const fs = require('fs');
const { spawn } = require('child_process');

// Kode Python sebagai string
const pythonCode = `
from pydub import AudioSegment
import time
from colorama import Fore, init
import threading

# Initialize colorama
init(autoreset=True)

# Delay untuk masing-masing lirik
delays = [
    0.10,  # Delay untuk lirik pertama
    0.1,   # Delay untuk lirik kedua
    0.15,  # Delay untuk lirik ketiga
    0.16,  # Delay untuk lirik keempat
    0.15,  # Delay untuk lirik kelima
    0.14,  # Delay untuk lirik keenam
    0.12,  # Delay untuk lirik ketujuh
    0.15,  # Delay untuk lirik kedelapan
    0.15,  # Delay untuk lirik kesembilan
    0.14,  # Delay untuk lirik kesepuluh
    0.13,  # Delay untuk lirik kesebelas
    0.14,  # Delay untuk lirik keduabelas
    0.12,  # Delay untuk lirik ketigabelas
    0.15,  # Delay untuk lirik keempatbelas
    0.14,  # Delay untuk lirik kelimabelas
    0.14,  # Delay untuk lirik keenambelas
    0.14   # Delay untuk lirik ketujuhbelas
]

# Load the audio file
audio_file_path = 'koiire_kobo.mp3'
song = AudioSegment.from_mp3(audio_file_path)
song.export('output.wav', format='wav')  # Convert to WAV for compatibility

# Lirik lagu dengan waktu tampil
lyrics = [
    (0, "kata mama anak kecil belum boleh cinta-cintaan"),
    (5, "tapi..."),
    (6.7, "Tooi you de chikaku ni ita"),
    (12.12, "Marude unmei no you ni"),
    (17, "Itsudatte tonari ni ite"),
    (21, "Watashi dake o mitsumetekureta ne"),
    (27, "Suki yo"),
    (28, "Ima anata ni omoi nosete"),
    (32, "Hora"),
    (33, "sunao ni naru no watashi"),
    (36, "Kono saki motto soba ni ite mo ii ka na?"),
    (42, "Koi to koi ga kasanatte"),
    (46, "Suki yo"),
    (47, "Ima anata ni omoi todoke"),
    (51, "Nee, kizuitekuremasen ka?"),
    (56, "Doushiyou mo nai kurai"),
    (60, "Kokoro made suki ni natteiku")
]

# Warna untuk masing-masing lirik
colors = [Fore.RED, Fore.GREEN, Fore.YELLOW, Fore.BLUE, Fore.MAGENTA, Fore.CYAN, Fore.WHITE]

# Function to display lyrics with typing effect
def display_lyrics(lyrics, delays):
    start_time = time.time()
    for i, (timestamp, line) in enumerate(lyrics):
        while time.time() - start_time < timestamp:
            time.sleep(0.1)
        color = colors[i % len(colors)]
        for char in line:
            print(color + char, end='', flush=True)
            time.sleep(delays[i])  # Adjust the speed of typing effect based on delay for each lyric
        print()  # New line after each lyric

# Play the song and display lyrics
lyrics_thread = threading.Thread(target=display_lyrics, args=(lyrics, delays))
lyrics_thread.start()
`;

// Menulis kode Python ke file sementara
const pythonFilePath = 'temp_script.py';
fs.writeFileSync(pythonFilePath, pythonCode);

// Fungsi untuk menjalankan skrip Python
const runPythonScript = (scriptPath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Output dari Python: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error dari Python: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Proses Python keluar dengan kode ${code}`);
            } else {
                resolve();
            }
        });
    });
};

// Fungsi delay menggunakan Promise
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

    // Menjalankan skrip Python
    await runPythonScript(pythonFilePath)
        .then(() => {
            console.log('Skrip Python selesai dijalankan.');
            // Menghapus file sementara setelah eksekusi selesai
            fs.unlinkSync(pythonFilePath);
        })
        .catch((error) => {
            console.error('Error saat menjalankan skrip Python:', error);
            // Menghapus file sementara jika terjadi error
            fs.unlinkSync(pythonFilePath);
        });

    // Mengirim file audio sebagai voice note
    const audioFilePath = 'output.wav';
    if (fs.existsSync(audioFilePath)) {
        await conn.sendMessage(m.chat, { audio: { url: audioFilePath }, mimetype: 'audio/wav', ptt: true });
        fs.unlinkSync(audioFilePath); // Hapus file audio setelah dikirim
    } else {
        console.error('File audio tidak ditemukan.');
    }
};

handler.help = ['loading'];
handler.tags = ['fun'];
handler.command = /^(loading)$/i;

module.exports = handler;