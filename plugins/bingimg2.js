

let {
    BingImageClient
} = require('../lib/bingimage.js');

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text;

    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw 'Input teks atau reply teks!';
    }

    await m.reply(wait);

    try {
        const res = new BingImageCreator({
            cookie: "1JdrVHBbcJfHYpwh4QBBZ_2gOzvf90gwb_QXrs_t5kmYnrUemFv0IT8NhMseWfQqQtiq_tRi20WKqSE2780dCeLvBIQcxHgNJjsQghTAHchnMRvGZ6ZprqbQ8x55XavHLtvJoXCZzM4mJTW8KU42ix5iBBrgzuzsWp0n8siAPTcUr36e6d3xF-CfE1_BbScynpbKn-1KBH4ihJwkGttsKzgFCL_8_mzHNzI3VqUyS85Q"
          //add your own cookie
        });
        const data = await res.createImage(text);

        const filteredData = data.filter(file => !file.endsWith('.svg'));
        const totalCount = filteredData.length;

        if (totalCount > 0) {
            for (let i = 0; i < totalCount; i++) {
                try {
                    await conn.sendFile(
                        m.chat,
                        filteredData[i],
                        '',
                        `Image *(${i + 1}/${totalCount})*`,
                        m,
                        false, {
                            mentions: [m.sender],
                        }
                    );
                } catch (error) {
                    console.error(`Error sending file: ${error.message}`);
                    await m.reply(`Failed to send image *(${i + 1}/${totalCount})*`);
                }
            }
        } else {
            await m.reply('No images found after filtering.');
        }
    } catch (error) {
        console.error(`Error in handler: ${error.message}`);
        await m.reply('An error occurred while processing the request.');
    }
};

handler.help = ["bingimg2 *<query>*"];
handler.tags = ["ai"];
handler.command = /^(bingimg2)$/i;
module.exports = handler;
