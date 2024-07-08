/* Fitur asyu mumet ndasku bangsat emang
*/



/*
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
const readline = require('readline')
const qrcode = require('qrcode');
const NodeCache = require('node-cache');
const { makeWASocket, protoType, serialize } = require('../lib/simple.js');
const simple = require('../lib/simple')
const stor = require('../lib/store.js');
const P = require('pino');
const fs = require('fs');
const data = fs.readFileSync('./src/jadibot.json');
const json = JSON.parse(data);
const { createRequire } = require('module');
const { groupsUpdate } = require('../handler.js');
const handlers = require('../handler.js');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const question = (text) => new Promise((resolve) => rl.question(text, resolve))
    const msgRetryCounterCache = new NodeCache()

    global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
    global.timestamp = {
        start: new Date
    }

const isNumber = x => typeof x === 'number' && !isNaN(x);
global.tryConnect = [];
if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (conn.user.jid !== global.conn.user.jid) return m.reply('Tidak bisa membuat Bot pada user jadibot!');

    const authFile = `${opts._[0] || 'plugin/jadibot'+m.sender.split("@")[0]}`
    global.isInit = !fs.existsSync(authFile)
    let { state, saveState, saveCreds } = await useMultiFileAuthState(authFile)

    const connectionOptions = {
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }).child({ level: 'silent' })),
        },
        logger: P({ level: 'silent' }),
        browser: ['clone Elaina-MD', 'Safari', '1.0.0'],
        printQRInTerminal: false,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ''
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    }

    const delay = (time) => new Promise((res) => setTimeout(res, time));

    const teks = `*Input kode ini untuk menjadi Bot (Clone)*\n\nLangkah-langkah untuk memindai:\n1.- Ketuk tiga titik di sudut kanan atas di beranda WhatsApp Anda\n2.- Ketuk WhatsApp web atau perangkat yang sudah terhubung\n4.- Klik Tautkan dengan nomor telepon saja\n3.- Masukan kode\n\n*Jika belum terkoneksi ketik \\/jadibot\\, dan tunggu sampai terkoneksi. Jangan melakukan spam jadibot untuk menghindari ERROR pada sistem Bot Nightmare MD*`;

    global.conn = simple.makeWASocket(connectionOptions)

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
    async function needUpdate(update) {
        const { connection, lastDisconnect, qr} = update
    
        if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== WebSocket.CONNECTING) {
                global.tryConnect(true)
                m.reply('Connecting...')
            } else if(connection === 'open'){
              conns.reply(m.chat, `Berhasil mengkoneksikan dengan WhatsApp.\n*NOTE: Cloning Bot by Nightmare MD*\nNomor: ${conn.user.jid.split`@`[0]}\nJoin: ${timestamp}\n`, m)
                global.tryConnect[m.sender] = 0
                global.conns[m.sender] = conn
            } else if(connection === 'close'){
              m.reply('koneksi terputus!! wait...') 
            } else {
              console.log('Report Owner! BugError: '+lastDisconnect)
            }
        }
async function connectionUpdate(update) {
    const { connection, lastDisconnect } = update
    global.timestamp.connect = new Date
    if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== WebSocket.CONNECTING) {
        console.log(global.reloadHandler(true))
    }
    if (global.db.data == null) await loadDatabase()
    // console.log(JSON.stringify(update, null, 4))
}

let isInit = true
    global.reloadHandler = function (restatConn, close) {
        //let handler = imports('../handler')
        if (restatConn) {
            try { global.conn.ws.close() } catch { }
            global.conn = {
                ...global.conn,
                ...simple.makeWASocket(connectionOptions)
            }
        }
        if (!isInit||!close) {
            conn.ev.off('messages.upsert', conn.handler)
            conn.ev.off('group-participants.update', conn.onGroupUpdate)
            //  conn.ev.off('message.delete', conn.onDelete)
            conn.ev.off('connection.update', conn.connectionUpdate)
            conn.ev.off('creds.update', conn.credsUpdate)
        }

        conn.welcome = 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc'
        conn.bye = 'Selamat tinggal @user!'
        conn.spromote = '@user telah diangkat menjadi admin group!\n\n_Congratss_'
        conn.sdemote = '@user sekarang bukan lagi admin group!\n\n_Sad :(_'
        conn.readmore = readMore
        conn.sDesc = 'Deskripsi telah diubah ke \n@desc'
        conn.sSubject = 'Judul grup telah diubah ke \n@subject'
        conn.sIcon = 'Icon grup telah diubah!'
        conn.sRevoke = 'Link group telah diubah ke \n@revoke'
        conn.handler = handler.handler.bind(conn)
        //conn.participantsUpdate = handler.participantsUpdate.bind(conn)
        // conn.onDelete = handler.delete.bind(conn)
        conn.connectionUpdate = connectionUpdate.bind(conn)
        conn.credsUpdate = saveCreds.bind(conn)
        conn.onGroupUpdate = groupsUpdate.bind(conn)

        conn.ev.on('messages.upsert', conn.handler)
        conn.ev.on('group-participants.update', conn.participantsUpdate)
        // conn.ev.on('message.delete', conn.onDelete)
        conn.ev.on('connection.update', conn.connectionUpdate)
        conn.ev.on('creds.update', conn.credsUpdate)
        isInit = false
        return true
    }
await conn.tryConnect()
}
handler.help = ['jadibot'];
handler.tags = ['main'];
handler.command = /^(jadibot)$/i;
module.exports = handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
*/