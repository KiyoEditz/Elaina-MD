let handler = async (m, { conn, usedPrefix: p, }) => {
  let teks = `  
  *Perubahan 29 Desember 2021:*
_*New:*_
Leaderboard:
leaderboardgroup
topskata
topskatagroup
topcmd

_*Update:*_
leaderboard anti tag
claim levelling

_*Fix:*_
skata
semoji
doubling game
absen no tag

  *Perubahan 19 November 2021:*
_*New:*_
Gambar: PPCouple
Game: Sambung kata

_*Update:*_
Jadibot: Set Owner, Setting
Group: Init setiap chat

_*Fix:*_
Download: Fb

_*Deleted*_
Download: APK downloader

*Perubahan 22 Oktober 2021:*
_*New:*_
Setting: Game

  _*Update:*_
Sticker: Trigger tag
  
_*Fix:*_
layarkaca, animeinfo

*Perubahan 19 Oktober 2021:*
_*New:*_
Maker: Harta tahta custom => *${p}customtahta*
Tools: Alkitab => *${p}alkitab*
      Hadis => *${p}hadis*
      Spamcall => *${p}spamcall*
Search: Id free fire check => *${p}epep*
        Animeinfo => *${p}animeinfo*
        layarkaca => *${p}layarkaca*
Stiker: dadu => *${p}dadu*
Fun: Nama Purba => *${p}purba*
Media downloader: Joox Music => *${p}joox*

  _*Update:*_
Sticker: Stiker Emoji => *${p}semoji*
Regiter & unregister
Antilink group
Auto kick send bug gc

_*Fix:*_
Fun: simi chat => *${p}simi*
Game: delttt, suit, bisakah, apakah, kapankah
Search: *${p}tiktokstalk*

*Perubahan 17 Oktober 2021:*

_*New:*_
Tools: Kodepos => *${p}kodepos*
       Info => *${p}setting*

_*Update:*_
Downloader: Tiktok caption, IG caption, server
Maker: Nulis => *${p}nulis*
Tools: tts, tr bisa langsung reply pesam => *${p}tts*, *${p}tr*

_*Fix:*_
Game: tebakkimia => *${p}tebakkimia*
      Fix bantuan
${conn.readmore}
*Perubahan 15 Oktober 2021:*

_*Update:*_
Stiker: smeme, snobg, wasted, trigger dsbg bisa langsung balas stiker

_*Fix:*_
Stiker: attp => *${p}attp*
        ttp => *${p}ttp*
Game: tekateki => *${p}tekateki*

*Perubahan 06 Oktober 2021:*

_*Fix:*_
Stiker: wasted, trigger => *${p}wasted, ${p}trigger*

*Perubahan 28 September 2021:*

_*New:*_
Game suit PvP => *${p}suit*
Button di game, absen
Style menu

_*Fix:*_
Quotes: Bijak => *${p}bijak*
Maker: Japan => *${p}japan*
Stiker: meme => *${p}smeme*
Optimasi teks tiap fitur
Merapikan menu

*Perubahan 22 Juli 2021:*
● add vn di bbrp fitur
● Update *${p}enable* 
● Fix bug levelup & role
● Fix some bug

*Perubahan 18 Juli 2021:*
● Fix *${p}pinterest*

*Perubahan 16 Juli 2021:*
● in *${p}Menu Game*
  => New *${p}tekateki*
     Fix *${p}tebaklagu*
● Call maximum 3x
● Update *${p}*enable

*Perubahan 14 Juli 2021:*
● Add *${p}Menu Kelas*
  => Add vote, absen
● Add *${p}wikipedia*
● Add *${p}kbbi*
● Add *${p}scan*

*Perubahan 8 Juli 2021:*
● Add Role in profile (beta)
● Add level limit
● Add *${p}role*
● Add *${p}groupinfo*
● Add *${p}togif*
● Add *${p}toimg2*
● Add *${p}stickerline*
● Update gif *${p}sticker*
● Add some in menu owner

*Perubahan 5 Juli 2021:*
● Fix welcome: send photo
● Fix *${p}igstory*
● Change, update=> *${p}daftarulang*
  Bisa ganti nama :v

● Update auto *${p}steal*
● Add *${p}menu editor*
● Add *${p}menu penyimpanan*
● in Premium => Auto steal in sticker (get name)

*Perubahan 4 Juli 2021:*
● Update *${p}stickerwa*


*Perubahan 3 Juli 2021:*
● Add in group *${p}setpp*
● Update harga *${p}sewabot/premium*
● Update *${p}ytmp4*
● Fix *${p}bctime* 

*Perubahan 2 Juli 2021:*
● in Menu game => 
  Add *${p}tebakkimia*
  Add *${p}tebakanime*

*Perubahan 1 Juli 2021:*
● Update *${p}ytmp4* => 
 custom resolusi
 ● Update Welcome
 ● Restore *${p}menu owner*
 ● *${p}setcmd* hanya untuk Premium
 ● fix *${p}play*

*Perubahan 30 Juni 2021:*
● New referal code bot => *${p}ref*
● Add *${p}Revoke* (reset link)
● Add *${p}tomp3*
● Add Desc Group in welcome 
   *${p}setwelcome*
● Update url youtube story in *${p}yt*
● Update *${p}semoji*
● Fix *${p}ttp*
● Fix *${p}delcmd*
● Fix *${p}caklontong*
● in Menu game => 
  Add *${p}tebaklirik*
  Move to group only
● Auto block if call/vcall

 *Perubahan 16 Juni 2021:*
● New; Perintah dengan media
● Fix *${p}stickerwa* <pencarian>
● in Menu gambar => Add
   *${p}bts*
   *${p}exo*
● Fix *${p}tebakgambar*
● Detail setelah melakukan AFK
● Custom bot untuk admin group, bisa mengatur on/off nya bot ( *${p}bot* [on/off]) 

*Perubahan 13 Juni 2021:*
● Update Style
● in Menu gambar => Add
   ${p}waifu
   ${p}husbu
   ${p}loli
   ${p}neko
● Fix ${p}smeme
● Fix ${p}wallpaperanime
● Add ${p}ytcomment
● Add ${p}broadcasttime
● Add ${p}rules

*Perubahan 5 Juni 2021:*
● Add Game Baru 
  ${p}asahotak
  ${p}tebakkata
  ${p}susunkata
  (${p}menu game)
● Fitur ${p}join sudah bisa langsung masuk tanpa konfirmasi owner (khusus premium)
● Penambahan jumlah ${p}claim untuk user premium

*Perubahan 26 Mei 2021:*
● Add ${p}save nama
● Fix Anonymous Chat

*Perubahan 21 Mei 2021:*
● Add ${p}anony chat (cek di menu)
● Add ${p}setbotpp(owner/jadibot)
● Add ${p}listpremium
● Add ${p}getsider(group)
● Add ${p}upload
● Add XP jika menang(game Tictactoe)
● Custom room Tictactoe
● Add & Optimasi ${p}ping
● Try fix ${p}tiktok, ig
● Other

*Perubahan 16 Mei 2021:*
● Add game ${p}tictactoe
● optimasi ${p}translate
● Add maker ${p}shaunthesheep

*Perubahan 11 Mei 2021:*
● Add && Update ${p}attp, ttp, ttp2-ttp6
● Add game ${p}caklontong
● Add game ${p}siapaaku
● Add fitur ${p}request
● Fix ${p}enable welcome, setwelcome, setbye
● Fix ${p}play && some error
● Update ${p}inspect
● Optimasi ${p}jadibot

*Perubahan 10 Mei 2021:*
● Fix ${p}tebakgambar + hd
● Fix ${p}chord
● Add ${p}info
● Optimasi afk

*Perubahan 5 Mei 2021:*
● Add ${p}tebaklagu (beta)
● Add ${p}tebakjenaka (beta)
● Ytmp4 kualitas 720p

*Perubahan 3 Mei 2021:*
● Add ${p}trigger
● Add ${p}semoji
● Add ${p}ytsearch
● Add ${p}attp2
● update ${p}attp
● Update welcome, bye group

*Perubahan 1 Mei 2021:*
● Update fitur ${p}lirik
● Add ${p}downloadfilm
● Fix ${p}enable
● Fix some error

*Perubahan 25 April 2021:*
● Add fitur ${p}ttp3
● Add ${p}enable autolevelup
● Add ${p}inspect linkgroup chat.whatsapp.com
● Add ${p}info
● Add ${p}rules
● Optimasi ${p}limit

*Perubahan 22 April 2021:*
● Update ${p}snobg
● Add Fitur ${p}tiktokstalk
● Fix error IG, Tiktok,

*Perubahan 20 April 2021:*
● Update optimasi Menu
● Add Fitur ${p}wait
  Mencari judul anime berdasarkan gambar
● Penambahan alternatif ${p}ig2

*Perubahan 17 April 2021:*
● Update fitur ${p}getvn
	
*Perubahan 15 April 2021:*
● Update fitur ${p}ttp, ${p}ttp2
● Add fitur ${p}sgay
● Optimasi Menu

*Perubahan 14 April 2021:*
● Fitur ${p}sc 
  stiker lingkaran 
● Fitur ${p}tovideo
  stiker gif ke video

*Perubahan 12 April 2021:*
● Fitur ${p}translate  
  
*Perubahan 11 April 2021:*
● Fitur ${p}meme (perbaikan)
● Fitur ${p}darkjoke
● Fitur ${p}twitter
● Fitur ${p}cuaca

*Perubahan 10 April 2021:*
● Fitur ${p}chord 
● Fitur ${p}wiki
● Fitur ${p}ramaljodoh
● Fitur ${p}Jadwalsholat
● Fitur ${p}quotes
● Tiktok tanpa watermark(${p}tiktok)
● Anime download (${p}anime)
`.trim()
  conn.fakeReply(m.chat, teks, '0@s.whatsapp.net', '*Perubahan/Changelog/Update Levi BOT*', 'status@broadcast')
}
handler.command = /^baru$/i
module.exports = handler