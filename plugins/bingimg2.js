

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
            cookie: "1sfTMLE7SIGaVvH4IFq0EhSvl-tf oKDXbvwV2ZqaU1yZWJ8rJredf 04RtZtjPSimcVy0yn1s5IMHM4 NZoi30ghgww5ZbZliweetOpq72 DLjio514r1tNNkAq8z-g87zHtCX XZqr_jd0jcXPFK7KfyDCsBHkEK QjXZiQUm1RVTA3Jal4QdMo6а oPbD_wklbKw8X2Tbe9LQHEHH GgBUor_Asg"
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
