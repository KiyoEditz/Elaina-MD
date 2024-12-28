const fetch = require('node-fetch');
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia
} = require('@adiwajshing/baileys');

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw 'Silahkan Taruh Nama Yang Mau Dicari.'

  const username = text.trim();

  try {
    let githubData = await getGithubData(username);
    if (!githubData) {
      return conn.sendMessage(m.chat, { text: 'GitHub user not found.' }, { quoted: m });
    }

    // Menyusun pesan untuk dikirim
    let messageText = `
GitHub Profile Info:
- Username: ${githubData.login}
- Name: ${githubData.name || 'Not available'}
- Bio: ${githubData.bio || 'No bio available'}
- Location: ${githubData.location || 'No location available'}
- Public Repos: ${githubData.public_repos}
- Followers: ${githubData.followers}
- Following: ${githubData.following}
- Profile URL: https://github.com/${githubData.login}
    `;

    // Gambar profil GitHub
    const profileImageUrl = githubData.avatar_url;

    if (command === 'githubstalkb') {
      let msgs = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            "messageContextInfo": {
              "deviceListMetadata": {},
              "deviceListMetadataVersion": 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: messageText
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'Bot powered by NazandCode'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false,
                ...await prepareWAMessageMedia({ image: { url: profileImageUrl } }, { upload: conn.waUploadToServer })
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "cta_url",
                    "buttonParamsJson": `{
                      "display_text":"Visit ${githubData.login}'s GitHub Profile",
                      "url":"https://github.com/${githubData.login}"
                    }`
                  }
                ],
              })
            })
          }
        }
      }, { quoted: m });

      return await conn.relayMessage(m.chat, msgs.message, {});

    } else {
      const profileMessage = `
GitHub Profile Info:
- Username: ${githubData.login}
- Name: ${githubData.name || 'Not available'}
- Bio: ${githubData.bio || 'No bio available'}
- Location: ${githubData.location || 'No location available'}
- Public Repos: ${githubData.public_repos}
- Followers: ${githubData.followers}
- Following: ${githubData.following}
- Profile URL: https://github.com/${githubData.login}
      `;
      
      await conn.sendMessage(m.chat, { image: { url: profileImageUrl }, caption: profileMessage }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    conn.sendFile(m.chat, 'error.mp3', 'error.mp3', null, m, true, { type: "audioMessage", ptt: true });
  }
}

async function getGithubData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.message === 'Not Found') return null;
    return data;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return null;
  }
}
handler.help = ['githubstalkb', 'githubstalk']
handler.tags = ['info']
handler.command = /^(githubstalkb|githubstalk)$/i //.githubstalkb untuk button
handler.limit = false
handler.register = true
module.export = handler;