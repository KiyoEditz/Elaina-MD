const roles = {
    'Beginner': 0,
    'Average III': 10,
    'Average II': 20,
    'Average I': 30,
    'Loud III': 40,
    'Loud II': 50,
    'Loud I': 60,
    'Flawless': 70,
    'Paragon': 80,
}

module.exports = {
    before(m) {
        let user = global.db.data.users[m.sender]
        let level = user.level
        let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
        user.role = role
        return true
    }
}