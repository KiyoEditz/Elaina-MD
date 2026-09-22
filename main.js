(async () => {
    require('./config')
    const {
        DisconnectReason,
        fetchLatestWaWebVersion,
        Browsers,
        jidNormalizedUser,
        makeCacheableSignalKeyStore,
        PHONENUMBER_MCC
    } = require('@whiskeysockets/baileys')
    const useSQLite = require('./lib/useSQLite')
    const readline = require('readline')
    const PHONENUMBER_MCC1 = {
        "1": "US/Canada",
        "44": "UK",
        "49": "Germany",
        "62": "Indonesia",
        "91": "India"
        // tambahkan negara lain jika perlu
    }    
    const chalk = require('chalk')
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
    const { initDatabase, loadDatabase: loadSqliteDB, saveDatabase: saveSqliteDB, migrateFromJson, deleteUser, deleteChat, closeDB } = require('./lib/sqliteDatabase')
    const { mergeLidUsers } = require('./lib/lidMerge')

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

    const sqlitePath = opts['db'] || `./data/${opts._[0] ? opts._[0] + '_' : ''}database.db`
    const sqliteInstance = initDatabase(sqlitePath)

    // Migrasi otomatis dari database.json jika SQLite belum berisi data
    if (fs.existsSync('./database.json')) {
        migrateFromJson(sqliteInstance, './database.json')
    }

    global.db = {
        sqlite: sqliteInstance,
        data: null,
        READ: false,
        read: async function () {
            this.data = loadSqliteDB(this.sqlite)
            return this.data
        },
        write: async function () {
            if (this.data && this.sqlite) {
                saveSqliteDB(this.sqlite, this.data)
            }
        },
        deleteUser: function (jid) {
            if (this.data?.users?.[jid]) delete this.data.users[jid]
            if (this.sqlite) deleteUser(this.sqlite, jid)
        },
        deleteChat: function (jid) {
            if (this.data?.chats?.[jid]) delete this.data.chats[jid]
            if (this.sqlite) deleteChat(this.sqlite, jid)
        }
    }
    global.DATABASE = global.db // Backwards Compatibility
    global.loadDatabase = async function loadDatabase() {
        if (global.db.data !== null) return global.db.data
        await global.db.read()
        global.db.data = {
            users: {},
            chats: {},
            settings: {},
            sessions: {},
            stats: {},
            msgs: {},
            menfess: {},
            sticker: {},
            chara: '',
            ...(global.db.data || {})
        }
        global.db.chain = _.chain(global.db.data)
        return global.db.data
    }
    loadDatabase()

    // if (opts['cluster']) {
    //   require('./lib/cluster').Cluster()
    // }
    const authFolder = `${opts._[0] || 'session'}`
    const { state, saveCreds, db: sessionDB } = await useSQLite(authFolder)
    global.isInit = !state.creds.registered

    let { version, isLatest } = await fetchLatestWaWebVersion().catch(() => ({
        version: [2, 3000, 1048092860],
        isLatest: false
    }))
    console.log(chalk.green(`Using WA Web v${version.join('.')}, isLatest: ${isLatest}`))

    const connectionOptions = {
        version,
        logger: P({ level: 'silent' }),
        browser: Browsers.ubuntu('Edge'),
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60_000,
        keepAliveIntervalMs: 30_000,
        retryRequestDelayMs: 250,
        maxMsgRetryCount: 5,
        printQRInTerminal: opts['pairing'] || global.pairingNumber ? false : true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }).child({ level: 'silent' })),
        },
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await (global.conn?.loadMessage ? global.conn.loadMessage(key.id) : null)
            return msg?.message || ''
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
        cachedGroupMetadata: (jid) => (global.conn && global.conn.chats ? global.conn.chats[jid] : undefined),
    }

    global.conn = simple.makeWASocket(connectionOptions)

    if (!conn.authState.creds.registered) {
        let phoneNumber = global.pairingNumber ? global.pairingNumber.toString().replace(/[^0-9]/g, '') : ''
        if (!phoneNumber) {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            // Ask again when entering the wrong number
            if (!Object.keys(PHONENUMBER_MCC1).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))
                phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            }
            rl.close()
        }

        console.log(chalk.bgWhite(chalk.blue('Generating code...')))
        const requestPairing = async (retry = 0) => {
            try {
                let code = await conn.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
            } catch (e) {
                if (retry < 5) {
                    console.log(chalk.yellow(`Waiting for connection to be ready, retrying pairing code in 3s (${retry + 1}/5)...`))
                    setTimeout(() => requestPairing(retry + 1), 3000)
                } else {
                    console.error('Failed to get pairing code:', e)
                }
            }
        }
        setTimeout(() => requestPairing(), 3000)
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
        const { connection, lastDisconnect, isOnline, receivedPendingNotifications } = update
        global.timestamp.connect = new Date

        if (connection === 'connecting') console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'))
        if (connection === 'open') {
            console.log(chalk.green('✅ Tersambung'))
            // Otomatis sinkronisasi dan merge data @lid ke JID nomor WhatsApp (@s.whatsapp.net)
            setTimeout(async () => {
                try {
                    await mergeLidUsers(conn)
                } catch (err) {
                    console.error('[LID-Merge Error]', err)
                }
            }, 5000)
        }
        if (isOnline === true) console.log(chalk.green('Status Aktif'))
        else if (isOnline === false) console.log(chalk.red('Status Mati'))
        if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'))

        const output = lastDisconnect?.error?.output
        if (output?.payload) {
            if (output.statusCode === DisconnectReason.loggedOut || output.statusCode === 401) {
                if (conn.authState?.creds?.registered) {
                    console.log(chalk.red('Session logged out. Recreate session...'))
                    if (sessionDB) {
                        try { sessionDB.close() } catch { }
                    }
                    fs.rmSync(authFolder, { recursive: true, force: true })
                    if (process.send) process.send('reset')
                    else process.exit(1)
                    return
                }
            } else if (output.statusCode === 403) {
                console.log(chalk.red('WhatsApp account banned :D'))
                process.exit(0)
            } else if (output.statusCode === 515) {
                console.log(chalk.yellow('Restart Required, Restarting....'))
            } else if (output.statusCode === 428) {
                console.log(chalk.yellow('Connection closed, Restarting....'))
            } else if (output.statusCode === 408) {
                console.log(chalk.yellow('Connection timed out, Restarting....'))
            } else {
                console.log(chalk.red(output.payload.message || output.statusCode))
            }
            await global.reloadHandler(true)
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
            const oldChats = global.conn?.chats || {}
            try { global.conn.ws.close() } catch { }
            if (global.conn?.ev) global.conn.ev.removeAllListeners()
            global.conn = simple.makeWASocket(connectionOptions, { chats: oldChats })
            isInit = true
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
    async function filesInit() {
        for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
            try {
                global.plugins[filename] = require(path.join(pluginFolder, filename))
            } catch (e) {
                conn.logger.error(e)
                delete global.plugins[filename]
            }
            await new Promise(r => setImmediate(r))
        }
        console.log(chalk.green(`Successfully Loaded ${Object.keys(global.plugins).length} Plugins`))
    }
    filesInit()
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

    const handleExit = () => {
        if (global.db && global.db.data && global.db.sqlite) {
            try {
                console.log(chalk.yellow('Menyimpan perubahan database ke SQLite sebelum keluar...'))
                saveSqliteDB(global.db.sqlite, global.db.data)
                closeDB(global.db.sqlite)
            } catch (e) {
                console.error('Error saat menutup database SQLite:', e)
            }
        }
        if (sessionDB) {
            try { sessionDB.close() } catch { }
        }
    }
    process.on('SIGINT', () => {
        handleExit()
        process.exit(0)
    })
    process.on('exit', handleExit)
})()