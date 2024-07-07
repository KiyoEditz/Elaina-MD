const {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    toBuffer,
    makeInMemoryStore,
    PHONENUMBER_MCC,
    makeCacheableSignalKeyStore
} = require('@adiwajshing/baileys');
const WebSocket = require('ws');
const qrcode = require('qrcode');
const NodeCache = require('node-cache');
const { makeWASocket, protoType, serialize } = require('../lib/simple.js');
const stor = require('../lib/store.js');
const pino = require('pino');
const fs = require('fs');
const data = fs.readFileSync('./src/jadibot.json');
const json = JSON.parse(data);
const { createRequire } = require('module');
const { groupsUpdate } = require('../handler.js');
const handlers = require('../handler.js');

let msgRetryCounterCache = new NodeCache();
let store = makeInMemoryStore({
    logger: pino().child({
        level: "silent",
        stream: "store",
    }),
});

const isNumber = x => typeof x === 'number' && !isNaN(x);
global.tryConnect = [];
if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (conn.user.jid !== global.conn.user.jid) return m.reply('Tidak bisa membuat Bot pada user jadibot!');

    let authFile = `plugins/jadibot/${m.sender.split("@")[0]}`;
    let isInit = !fs.existsSync(authFile);
    let { state, saveCreds } = await useMultiFileAuthState(authFile);
    let { version } = await fetchLatestBaileysVersion();

    const config = {
        version,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: "fatal" }).child({ level: "fatal" })
            ),
        },
        browser: ['Linux', 'Chrome', ''],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    };

    const delay = (time) => new Promise((res) => setTimeout(res, time));

    const teks = `*Input kode ini untuk menjadi Bot (Clone)*\n\nLangkah-langkah untuk memindai:\n1.- Ketuk tiga titik di sudut kanan atas di beranda WhatsApp Anda\n2.- Ketuk WhatsApp web atau perangkat yang sudah terhubung\n4.- Klik Tautkan dengan nomor telepon saja\n3.- Masukan kode\n\n*Jika belum terkoneksi ketik \\/jadibot\\, dan tunggu sampai terkoneksi. Jangan melakukan spam jadibot untuk menghindari ERROR pada sistem Bot Nightmare MD*`;

    store.bind(conn.ev);
    conn = makeWASocket(config);
    let ev = conn.ev;

    let date = new Date();
    let timestamp = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    conn.timestamp = timestamp;

    if (!conn.authState.creds.registered) {
        let phoneNumber = m.sender.split("@")[0].replace(/[^0-9]/g, "");

        if (!Object.keys(PHONENUMBER_MCC).some((v) => phoneNumber.startsWith(v)))
            throw "Start with your country's WhatsApp code, Example : 62xxx";

        await delay(2000);
        let code = await conn.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        m.reply("Your Code: " + code);

        if (!json.includes(m.sender)) {
            json.push(m.sender);
            fs.writeFileSync('./src/jadibot.json', JSON.stringify(json));
        }
    }

    await global.tryConnect(conn, m, false, false, saveCreds);
};

async function needUpdate(conn, m, update, saveCreds) {
    const { connection, lastDisconnect, qr } = update;

    if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== WebSocket.CONNECTING) {
        global.tryConnect(true);
        m.reply('Connecting...');
    } else if (connection === 'open') {
        m.reply(`Berhasil mengkoneksikan dengan WhatsApp.\n*NOTE: Cloning Bot by Nightmare MD*\nNomor: ${conn.user.jid.split`@`[0]}\nJoin: ${conn.timestamp}\n`);
        global.tryConnect[m.sender] = 0;
        global.conns[m.sender] = conn;
    } else if (connection === 'close') {
        m.reply('Koneksi terputus!! Tunggu sebentar...');
    } else {
        console.log('Report Owner! BugError: ' + lastDisconnect);
    }
}

global.tryConnect = async function tryConnect(conn, m, restatConn, close, saveCreds) {
    conn.welcome = 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc';
    conn.bye = 'Selamat tinggal @user!';
    conn.spromote = '@user sekarang admin!';
    conn.sdemote = '@user sekarang bukan admin!';
    conn.handler = handlers.handler.bind(conn);
    conn.connectionUpdate = needUpdate.bind(null, conn, m, saveCreds);
    conn.credsUpdate = saveCreds.bind(conn);

    if (restatConn) {
        try { conn.ws.close(); } catch { }
        conn = { ...conn, ...makeWASocket(config) };
    }

    if (!isInit || !close) {
        ev.off('messages.upsert', conn.handler);
        ev.off('group-participants.update', conn.onGroupUpdate);
        ev.off('connection.update', conn.connectionUpdate);
        ev.off('creds.update', conn.credsUpdate);
    }
    ev.on('messages.upsert', conn.handler);
    ev.on('connection.update', conn.connectionUpdate);
    ev.on('creds.update', conn.credsUpdate);
    ev.on('group-participants.update', conn.onGroupUpdate);
    isInit = false;
    return true;
};

handler.help = ['jadibot'];
handler.tags = ['main'];
handler.command = /^(jadibot)$/i;
module.exports = handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);