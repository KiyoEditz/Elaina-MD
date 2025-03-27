const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const handler = async (m, { conn, args, text }) => {
    if (!args[0] || !args[1]) return m.reply(`Silahkan masukkan 2 URL gambar!\n\nContoh: .faceswap [URL foto target] [URL wajah]`);
    
    const originalImgUrl = args[0];
    const targetFaceUrl = args[1];
    
    m.reply('*Melakukan Faceswap Tunggu 10-50 Detik Yaa*...');
    
    try {
        const result = await faceswap(originalImgUrl, targetFaceUrl);
        
        if (result.error) {
            return m.reply(`Gagal melakukan face swap : ${result.error}`);
        }
        
        if (result.data && result.data.url) {
            await conn.sendMessage(m.chat, { 
                image: { url: result.data.url }
            }, { quoted: m });
        } else {
            m.reply('Terjadi kesalahan saat memproses gambar.');
        }
    } catch (e) {
        m.reply(`Error: ${e.message}`);
    }
};

async function faceswap(original, target) {
    const API_URL = 'https://supawork.ai/supawork/headshot/api';
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 5000;

    const headers = {
        accept: 'application/json',
        'accept-language': 'id;q=0.5',
        authorization: 'null',
        'content-type': 'application/json',
        origin: 'https://supawork.ai',
        referer: 'https://supawork.ai/ai-face-swap',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
        const identityID = uuidv4();
        const postData = {
            aigc_app_code: 'face_swap_single',
            face_swap_type: 'single',
            target_image_url: original,
            target_face_url: target,
            identity_id: identityID,
            currency_type: 'silver'
        };

        const postResponse = await axios.post(`${API_URL}/fs/faceswap`, postData, {
            headers
        });
        if (postResponse.data.code !== 100000) {
            return {
                status: postResponse.status,
                error: postResponse.data.message || 'API error'
            };
        }

        for (let i = 0; i < MAX_RETRIES; i++) {
            await delay(RETRY_DELAY);
            const getResponse = await axios.get(`${API_URL}/media/aigc/result/list/v1`, {
                headers,
                params: {
                    page_no: 1,
                    page_size: 20,
                    identity_id: identityID
                }
            });

            if (getResponse.data.code !== 100000) {
                return {
                    status: getResponse.status,
                    error: getResponse.data.message || 'API error'
                };
            }

            const found = getResponse.data.data.list.find(
                (item) => item.list[0].input_urls.includes(original) &&
                item.list[0].input_urls.includes(target) &&
                item.list[0].status === 1
            );

            if (found) {
                return {
                    status: 200,
                    data: {
                        url: found.list[0].url[0],
                        request_id: postResponse.data.data.request_id
                    }
                };
            }
        }

        return {
            status: 200,
            error: 'Result not found within time limit'
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            error: error.message || 'Internal server error'
        };
    }
}

handler.help = ['faceswap'];
handler.command = ['faceswap', 'tukarwajah'];
handler.tags = ['ai', 'tools'];

module.exports = handler;