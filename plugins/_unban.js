let handler = m => m

handler.before = function (m) {
    let user = global.db.data.users[m.sender]
    if (!user.banned) return

    if (user.bannedtime < (new Date() * 1)) {
        user.banned = false
        delete user.bannedtime
    }
    return !0
}

module.exports = handler