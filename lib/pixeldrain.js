const axios = require('axios');

const pixeldrain = {
    extractLink: function (url) {
        const regex = /\/u\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    },

    dl: async function (fileId) {
        try {
            const meta = await axios.get(`https://pixeldrain.com/api/file/${fileId}/info`);
            const fileInfo = meta.data;

            const cdn = [
                'cdn.pd1.workers.dev',
                'cdn.pd6.workers.dev',
                'cdn.pd7.workers.dev',
                'cdn.pd8.workers.dev',
                'cdn.pd10.workers.dev'
            ];
            const rhost = cdn[Math.floor(Math.random() * cdn.length)];
/*
            const dlRes = await axios.get(`https://${rhost}/api/file/${fileId}`, {
                responseType: 'blob'
            });
            
            const fileBlob = dlRes.data;
            */
            const dlRes = `https://${rhost}/api/file/${fileId}`
            const dlRes2 = `https://pixeldrain.com/api/file/${fileId}`
            
            return {
                ...fileInfo,
                file: dlRes,
                file2: dlRes2
            };
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = { pixeldrain };