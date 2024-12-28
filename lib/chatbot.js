const axios = require('axios');
const qs = require('qs');
 
const chatbot = {
  getCharacters: async () => {
    try {
      const response = await axios.get("https://pastebin.com/raw/hX7neDQb");
      return response.data.characters;
    } catch (error) {
      console.error('Error fetching character data:', error);
      return [];
    }
  },
  instruct: (characters, name) => {
    if (!characters || !Array.isArray(characters)) {
      console.error('Karakter tidak valid atau tidak ditemukan.');
      return 'Karakter tidak ditemukan.';
    }
    const character = characters.find(char => char.name.toLowerCase() === name.toLowerCase());
    return character ? character.instruction : 'Karakter tidak ditemukan.';
  },
  chat: async (query, characterName) => {
    const characters = await chatbot.getCharacters();
    const prompt = chatbot.instruct(characters, characterName);
 
    const data = qs.stringify({
      'action': 'do_chat_with_ai',
      'ai_chatbot_nonce': '22aa996020',
      'ai_name': characterName,
      'origin': '',
      'instruction': prompt,
      'user_question': query
    });
 
    const config = {
      method: 'POST',
      url: 'https://onlinechatbot.ai/wp-admin/admin-ajax.php',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'accept-language': 'id-ID',
        'referer': 'https://onlinechatbot.ai/chatbots/sakura/',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        'origin': 'https://onlinechatbot.ai',
        'alt-used': 'onlinechatbot.ai',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=1, i',
        'te': 'trailers',
        'Cookie': '_ga=GA1.1.352853020.1734177283; _ga_PKHPWJ2GVY=GS1.1.1734177283.1.1.1734177320.0.0.0'
      },
      data: data
    };
 
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error in chat request:', error);
      return 'Terjadi kesalahan saat menghubungi chatbot.';
    }
  },
  create: async (name, prompt, query) => {
    const data = qs.stringify({
      'action': 'do_chat_with_ai',
      'ai_chatbot_nonce': '22aa996020',
      'ai_name': name,
      'origin': '',
      'instruction': prompt,
      'user_question': query
    });
 
    const config = {
      method: 'POST',
      url: 'https://onlinechatbot.ai/wp-admin/admin-ajax.php',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'accept-language': 'id-ID',
        'referer': 'https://onlinechatbot.ai/chatbots/sakura/',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        'origin': 'https://onlinechatbot.ai',
        'alt-used': 'onlinechatbot.ai',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=0',
        'te': 'trailers',
        'Cookie': '_ga_PKHPWJ2GVY=GS1.1.1732933582.1.1.1732933609.0.0.0; _ga=GA1.1.261902946.1732933582'
      },
      data: data
    };
 
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error in create request:', error);
      return 'Terjadi kesalahan saat menghubungi chatbot.';
    }
  }
};
 
module.exports = { chatbot };