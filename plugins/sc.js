let handler = async (m) => {
    conn.sendFile(m.chat, './src/vn/sc.mp3', 'suara.opus', null, m, true, {
        ephemeralExpiration: 86400
})
}
handler.help = ['sc']
handler.tags = ['info']
handler.command =  /^(sc|source)$/i

module.exports = handler