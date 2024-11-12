const Jimp = require ('jimp');
const axios = require('axios');

class GameSession {
	constructor(id, sMsg) {
		this.id = id;
		this.players = [];
		this.game = new SnakeAndLadderGame(sMsg);
	}
}

class SnakeAndLadderGame {
	constructor(sMsg) {
		this.sendMsg = sMsg;
		this.players = [];
		this.boardSize = 100;
		this.snakesAndLadders = [{
			start: 29,
			end: 7
		}, {
			start: 24,
			end: 12
		}, {
			start: 15,
			end: 37
		}, {
			start: 23,
			end: 41
		}, {
			start: 72,
			end: 36
		}, {
			start: 49,
			end: 86
		}, {
			start: 90,
			end: 56
		}, {
			start: 75,
			end: 64
		}, {
			start: 74,
			end: 95
		}, {
			start: 91,
			end: 72
		}, {
			start: 97,
			end: 78
		}];
		this.currentPositions = {};
		this.currentPlayerIndex = 0;
		this.bgImageUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg';
		this.player1ImageUrl = 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg';
		this.player2ImageUrl = 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg';
		this.bgImage = null;
		this.player1Image = null;
		this.player2Image = null;
		this.cellWidth = 40;
		this.cellHeight = 40;
		this.keyId = null;
		this.started = false;
	}

	initializeGame() {
		for (const player of this.players) {
			this.currentPositions[player] = 1;
		}
		this.currentPlayerIndex = 0;
		this.started = true;
	}

	rollDice() {
		return Math.floor(Math.random() * 6) + 1;
	}

	async movePlayer(player, steps) {
		if (this.players.length === 0) return;
		const currentPosition = this.currentPositions[player];
		let newPosition = currentPosition + steps;
		for (const otherPlayer of this.players) {
			if (otherPlayer !== player && this.currentPositions[otherPlayer] === newPosition) {
				const message = `😱 *Oh tidak!* @${player.split('@')[0]} *diinjak oleh* @${otherPlayer.split('@')[0]}.* Kembali ke awal cell.*`;
				await m.reply(message, null, {
					mentions: [player, otherPlayer]
				});
				newPosition = 1;
			}
		}
		const snakeOrLadder = this.snakesAndLadders.find(s => s.start === newPosition);
		if (snakeOrLadder) newPosition = snakeOrLadder.end;
		newPosition = Math.min(newPosition, this.boardSize);
		this.currentPositions[player] = newPosition;
	}

	async fetchImage(url) {
		try {
			const response = await axios.get(url, {
				responseType: 'arraybuffer'
			});
			return await Jimp.read(Buffer.from(response.data, 'binary'));
		} catch (error) {
			console.error(`Error fetching image from ${url}:`, error);
			throw error;
		}
	}

	async getBoardBuffer() {
		const board = new Jimp(420, 420);
		this.bgImage.resize(420, 420);
		board.composite(this.bgImage, 0, 0);
		for (const player of this.players) {
			const playerPosition = this.currentPositions[player];
			const playerImage = player === this.players[0] ? this.player1Image : this.player2Image;
			const playerX = ((playerPosition - 1) % 10) * this.cellWidth + 10;
			const playerY = (9 - Math.floor((playerPosition - 1) / 10)) * this.cellHeight + 10;
			board.composite(playerImage.clone().resize(this.cellWidth, this.cellHeight), playerX, playerY);
		}
		return board.getBufferAsync(Jimp.MIME_PNG);
	}

	async startGame(m, player1Name, player2Name) {
		await m.reply(`🐍🎲 *Selamat datang di Permainan Ular Tangga!* 🎲🐍 \n\n@${player1Name.split('@')[0]} vs @${player2Name.split('@')[0]}`, null, {
			mentions: [player1Name, player2Name]
		});
		this.players = [player1Name, player2Name];
		this.initializeGame();
		if (!this.bgImage) this.bgImage = await this.fetchImage(this.bgImageUrl);
		if (!this.player1Image) this.player1Image = await this.fetchImage(this.player1ImageUrl);
		if (!this.player2Image) this.player2Image = await this.fetchImage(this.player2ImageUrl);
		const boardBuffer = await this.getBoardBuffer();
		const {
			key
		} = await m.reply(boardBuffer);
		this.keyId = key;
	}

	async playTurn(m, player) {
		if (!this.players.length) {
			await m.reply('🛑 *Tidak ada permainan aktif.* Gunakan "!snake start" untuk memulai permainan baru.');
			return;
		}
		if (player !== this.players[this.currentPlayerIndex]) {
			await m.reply(`🕒 *Bukan giliranmu.* \n\nSekarang giliran @${this.players[this.currentPlayerIndex].split('@')[0]}`, null, {
				mentions: [this.players[this.currentPlayerIndex]]
			});
			return;
		}
		const diceRoll = this.rollDice();
		await m.reply(`🎲 @${player.split('@')[0]} *melempar dadu.*\n\n  - Dadu: *${diceRoll}*\n  - Dari kotak: *${this.currentPositions[player]}*\n  - Ke kotak: *${this.currentPositions[player] + diceRoll}*`, null, {
			mentions: [player]
		});
		if (diceRoll !== 6) {
			this.movePlayer(player, diceRoll);
			const snakeOrLadder = this.snakesAndLadders.find(s => s.start === this.currentPositions[player]);

			if (snakeOrLadder) {
				const action = snakeOrLadder.end < snakeOrLadder.start ? 'Mundur' : 'Maju';
				await m.reply(`🐍 @${player.split('@')[0]} menemukan ${action === 'Mundur' ? 'ular' : 'tangga'}! ${action} *ke kotak ${snakeOrLadder.end}.*`, null, {
					mentions: [player]
				});
				this.currentPositions[player] = snakeOrLadder.end;
			}

		}

		if (diceRoll !== 6) {
			this.switchPlayer();
		} else {
			await m.reply('🎲 Anda mendapat 6, jadi giliran Anda masih berlanjut.');
			this.movePlayer(player, diceRoll);
		}
		if (this.currentPositions[player] === this.boardSize) {
			await m.reply(`🎉 @${player.split('@')[0]} menang! Selamat!`, null, {
				mentions: [player]
			});
			this.resetSession();
		}
		const boardBuffer = await this.getBoardBuffer();
		const sendMsg = this.sendMsg;
		await sendMsg.sendMessage(m.chat, {
			delete: this.keyId
		});
		const {
			key
		} = await m.reply(boardBuffer);
		this.keyId = key;
		return;
	}

	addPlayer(player) {
		if (this.players.length < 2 && !this.players.includes(player) && player !== '') {
			this.players.push(player);

			return true;
		} else {
			return false;
		}
	}

	switchPlayer() {
		this.currentPlayerIndex = 1 - this.currentPlayerIndex;
	}

	resetSession() {
		this.players = [];
		this.currentPositions = {};
		this.currentPlayerIndex = 0;
		this.started = false;
	}

	isGameStarted() {
		return this.started;
	}
}

const handler = async (m, {
	conn,
	args,
	usedPrefix,
	command
}) => {
	conn.ulartangga = conn.ulartangga || {};
	const sessions = conn.ulartangga_ = conn.ulartangga_ || {};
	const sessionId = m.chat;
	const session = sessions[sessionId] || (sessions[sessionId] = new GameSession(sessionId, conn));
	const game = session.game;
	const {
		state
	} = conn.ulartangga[m.chat] || {
		state: false
	};

	switch (args[0]) {
		case 'join':
			if (state) return m.reply('🛑 *Permainan sudah dimulai.* Tidak dapat bergabung.');
			const playerName = m.sender;
			const joinSuccess = game.addPlayer(playerName);
			joinSuccess ? m.reply(`👋 @${playerName.split('@')[0]} *bergabung ke dalam permainan.*`, null, {
				mentions: [playerName]
			}) : m.reply('*Anda sudah bergabung atau permainan sudah penuh.* Tidak dapat bergabung.');
			break;

		case 'start':
			if (state) return m.reply('🛑 *Permainan sudah dimulai.* Tidak dapat memulai ulang.');
			conn.ulartangga[m.chat] = {
				...conn.ulartangga[m.chat],
				state: true
			};
			if (game.players.length === 2) {
				await game.startGame(m, game.players[0], game.players[1]);
			} else {
				await m.reply('👥 *Tidak cukup pemain untuk memulai permainan.* Diperlukan minimal 2 pemain.');
			}
			break;

		case 'roll':
			if (!state) return m.reply('🛑 *Permainan belum dimulai.* Ketik "!snake start" untuk memulai.');
			if (game.isGameStarted()) {
				const currentPlayer = game.players[game.currentPlayerIndex];
				if (m.sender !== currentPlayer) {
					await m.reply(`🕒 *Bukan giliranmu.* \n\nSekarang giliran @${currentPlayer.split('@')[0]}`, null, {
						mentions: [currentPlayer]
					});
				} else {
					await game.playTurn(m, currentPlayer);
				}
			} else {
				await m.reply('🛑 *Permainan belum dimulai.* Ketik "!snake start" untuk memulai.');
			}
			break;

		case 'reset':
			conn.ulartangga[m.chat] = {
				...conn.ulartangga[m.chat],
				state: false
			};
			session.game.resetSession();
			delete sessions[sessionId];
			await m.reply('🔄 *Sesi permainan direset.*');
			break;

		case 'help':
			await m.reply(`🎲🐍 *Permainan Ular Tangga* 🐍🎲\n\n*Commands:*\n- ${usedPrefix + command} join : Bergabung ke dalam permainan.\n- ${usedPrefix + command} start : Memulai permainan.\n- ${usedPrefix + command} roll : Melempar dadu untuk bergerak.\n- ${usedPrefix + command} reset : Mereset sesi permainan.`);
			break;

		default:
			m.reply(`❓ *Perintah tidak valid.* Gunakan ${usedPrefix + command} help untuk melihat daftar perintah.`);
	}
};

handler.help = ['ulartangga'];
handler.tags = ['rpg'];
handler.command = /^(ular(tangga)?|ladders|snak(e)?)$/i;

module.exports = handler;