(async () => {
    require('./config')
    const {
        useMultiFileAuthState,
        DisconnectReason,
        makeInMemoryStore,
        jidNormalizedUser,
        makeCacheableSignalKeyStore,
        PHONENUMBER_MCC
    } = require('@whiskeysockets/baileys')
    const readline = require('readline')
    const chalk = require('chalk')
    const cloudDBAdapter = require('./lib/cloudDBAdapter')
    const WebSocket = require('ws')
    const path = require('path')
    const fs = require('fs')
    const yargs = require('yargs/yargs')
    const cp = require('child_process')
    const _ = require('lodash')
    const syntaxerror = require('syntax-error')
    const P = require('pino')
    const os = require('os')
    const simple = require('./lib/simple')
    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)
    var low
    try {
        low = require('lowdb')
    } catch (e) {
        low = require('./lib/lowdb')
    }
    const { Low, JSONFile } = low
    const mongoDB = require('./lib/mongoDB')

    const NodeCache = require('node-cache')
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const question = (text) => new Promise((resolve) => rl.question(text, resolve))
    const msgRetryCounterCache = new NodeCache()

    global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
    global.timestamp = {
        start: new Date
    }

    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    // console.log({ opts })
    global.prefix = new RegExp('^[' + (opts['prefix'] || '!+/#.') + ']')
    const store = makeInMemoryStore({ logger: P().child({ level: 'fatal', stream: 'store' }) })

    global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ? new mongoDB(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))
    global.DATABASE = global.db // Backwards Compatibility
    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function () {
            (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null)
        }, 1 * 1000))
        if (global.db.data !== null) return
        global.db.READ = true
        await global.db.read()
        global.db.READ = false
        global.db.data = { users: {}, chats: {}, settings: {}, sessions: {}, stats: {}, msgs: {}, menfess: {}, sticker: {}, chara: '', ...(global.db.data || {}) }
        global.db.chain = _.chain(global.db.data)
    }
    loadDatabase()

    // if (opts['cluster']) {
    //   require('./lib/cluster').Cluster()
    // }
    const authFile = `${opts._[0] || 'session'}`
    global.isInit = !fs.existsSync(authFile)
    const { state, saveState, saveCreds } = await useMultiFileAuthState(authFile)

    const connectionOptions = {
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }).child({ level: 'silent' })),
        },
        logger: P({ level: 'silent' }),
        browser: ['Elaina-MD', 'Safari', '1.0.0'],
        version: [2, 3000, 1015901307],
        printQRInTerminal: opts['pairing'] ? false : true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ''
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    }

    global.conn = simple.makeWASocket(connectionOptions)

    if (opts['pairing'] && !conn.authState.creds.registered) {
        let phoneNumber
        if (!!global.pairingNumber) {
            phoneNumber = global.pairingNumber.toString().replace(/[^0-9]/g, '')
            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))
                process.exit(0)
            }
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            // Ask again when entering the wrong number
            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))
                phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
                rl.close()
            }
        }

        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
        }, 3000)
    }

    if (!opts['test']) {
        if (global.db) setInterval(async () => {
            if (global.db.data) await global.db.write()
            if (!opts['tmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
        }, 30 * 1000)
    }

    // Auto restart RAM when full
    var ramCheck = setInterval(() => {
        var ramUsage = process.memoryUsage().rss
        if (ramUsage >= global.ram_usage) {
            clearInterval(ramCheck)
            process.send('reset')
        }
    }, 60 * 1000) // every 1 minute

    // create directory tmp
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

    // clear tmp
    setInterval(() => {
        try {
            const tmpFiles = fs.readdirSync('./tmp')
            if (tmpFiles.length > 0) {
                tmpFiles.filter(v => !v.endsWith('.file')).map(v => fs.unlinkSync('./tmp/' + v))
            }
        } catch { }
    }, 60 * 1000 * 10) // every 10 minute

    async function connectionUpdate(update) {
        const { connection, lastDisconnect } = update
        global.timestamp.connect = new Date
        if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== WebSocket.CONNECTING) {
            console.log(global.reloadHandler(true))
        }
        if (global.db.data == null) await loadDatabase()
        // console.log(JSON.stringify(update, null, 4))
    }

    process.on('uncaughtException', console.error)
    // let strQuot = /([''])(?:(?=(\\?))\2.)*?\1/

    const imports = (path) => {
        path = require.resolve(path)
        let modules, retry = 0
        do {
            if (path in require.cache) delete require.cache[path]
            modules = require(path)
            retry++
        } while ((!modules || (Array.isArray(modules) || modules instanceof String) ? !(modules || []).length : typeof modules == 'object' && !Buffer.isBuffer(modules) ? !(Object.keys(modules || {})).length : true) && retry <= 10)
        return modules
    }
    let isInit = true
    global.reloadHandler = function (restatConn) {
        let handler = imports('./handler')
        if (restatConn) {
            try { global.conn.ws.close() } catch { }
            global.conn = {
                ...global.conn,
                ...simple.makeWASocket(connectionOptions)
            }
        }
        if (!isInit) {
            conn.ev.off('messages.upsert', conn.handler)
            conn.ev.off('group-participants.update', conn.participantsUpdate)
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
        conn.participantsUpdate = handler.participantsUpdate.bind(conn)
        // conn.onDelete = handler.delete.bind(conn)
        conn.connectionUpdate = connectionUpdate.bind(conn)
        conn.credsUpdate = saveCreds.bind(conn)

        conn.ev.on('messages.upsert', conn.handler)
        conn.ev.on('group-participants.update', conn.participantsUpdate)
        // conn.ev.on('message.delete', conn.onDelete)
        conn.ev.on('connection.update', conn.connectionUpdate)
        conn.ev.on('creds.update', conn.credsUpdate)
        isInit = false
        return true
    }

    let pluginFolder = path.join(__dirname, 'plugins')
    let pluginFilter = filename => /\.js$/.test(filename)
    global.plugins = {}
    for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            global.plugins[filename] = require(path.join(pluginFolder, filename))
        } catch (e) {
            conn.logger.error(e)
            delete global.plugins[filename]
        }
    }
    console.log(Object.keys(global.plugins))
    global.reload = (_ev, filename) => {
        if (pluginFilter(filename)) {
            let dir = path.join(pluginFolder, filename)
            if (dir in require.cache) {
                delete require.cache[dir]
                if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
                else {
                    conn.logger.warn(`deleted plugin '${filename}'`)
                    return delete global.plugins[filename]
                }
            } else conn.logger.info(`requiring new plugin '${filename}'`)
            let err = syntaxerror(fs.readFileSync(dir), filename)
            if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
            else try {
                global.plugins[filename] = require(dir)
            } catch (e) {
                conn.logger.error(e)
            } finally {
                global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
            }
        }
    }
    Object.freeze(global.reload)
    fs.watch(path.join(__dirname, 'plugins'), global.reload)
    global.reloadHandler()

    // Quick Test
    async function _quickTest() {
        let test = await Promise.all([
            cp.spawn('ffmpeg'),
            cp.spawn('ffprobe'),
            cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
            cp.spawn('convert'),
            cp.spawn('magick'),
            cp.spawn('gm'),
            cp.spawn('find', ['--version'])
        ].map(p => {
            return Promise.race([
                new Promise(resolve => {
                    p.on('close', code => {
                        resolve(code !== 127)
                    })
                }),
                new Promise(resolve => {
                    p.on('error', _ => resolve(false))
                })
            ])
        }))
        let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
        console.log(test)
        let s = global.support = {
            ffmpeg,
            ffprobe,
            ffmpegWebp,
            convert,
            magick,
            gm,
            find
        }
        // require('./lib/sticker').support = s
        Object.freeze(global.support)

        if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
        if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
        if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
    }

    _quickTest()
        .then(() => conn.logger.info('Quick Test Done'))
        .catch(console.error)
})()