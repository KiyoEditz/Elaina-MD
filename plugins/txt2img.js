/* 
[Txt2img by Flux]
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const handler = async (m, { conn, usedPrefix, command, text, isOwner, isAdmin, isBotAdmin, isPrems, chatUpdate }) => {
    if (!text) throw `*\u2022 Contoh :* ${usedPrefix + command} *[prompt]*`;
    m.reply(wait);
    
    const data = await flux({
      prompt: text,
    });
    
    for (const i of data.data.images) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: i },
          caption: `*\u2022 Prompt :* ${text}`,
        },
        {
          quoted: m,
        },
      );
    }
  };
  
  handler.help = ["flux [Prompt]"];
  handler.tags = ["ai"];
  handler.command = ["flux"];
  
  module.exports = handler;
  
  async function flux(options) {
    try {
      options = {
        prompt: options?.prompt,
        seed: options?.seed || Math.floor(Math.random() * 2147483647) + 1,
        random_seed: options?.random_seed ?? true,
        width: options?.width ?? 512,
        height: options?.height ?? 512,
        steps: options?.steps ?? 8,
      };
    
      if (!options.prompt) {
        return {
          status: false,
          message: "undefined reading prompt!",
        };
      }
      
      const session_hash = string(11);
      
      const joinResponse = await fetch("https://black-forest-labs-flux-1-schnell.hf.space/queue/join", {
        method: "POST",
        headers: {
          authority: "black-forest-labs-flux-1-schnell.hf.space",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            options.prompt,
            options.seed,
            options.random_seed,
            options.width,
            options.height,
            options.steps,
          ],
          event_data: null,
          fn_index: 2,
          trigger_id: 5,
          session_hash: session_hash,
        }),
      });
      
      if (!joinResponse.ok) throw new Error("Failed to join queue");
      
      const dataResponse = await fetch(`https://black-forest-labs-flux-1-schnell.hf.space/queue/data?session_hash=${session_hash}`, {
        headers: {
          authority: "black-forest-labs-flux-1-schnell.hf.space",
        },
      });
      
      if (!dataResponse.ok) throw new Error("Failed to retrieve data");
      
      const rawData = await dataResponse.text();
      const lines = rawData.split("\n");
      const jsonObjects = [];
      
      lines.forEach((line) => {
        if (line.startsWith("data: ")) {
          try {
            const jsonString = line.substring(6).trim();
            const jsonObject = JSON.parse(jsonString);
            jsonObjects.push(jsonObject);
          } catch (error) {
            throw new Error("Failed to parse JSON");
          }
        }
      });
      
      const result = jsonObjects.find((d) => d.msg === "process_completed") || {};
      
      if (!result?.success) {
        return {
          status: false,
          message: result,
        };
      }
      
      const images = result.output.data
        .filter((d) => typeof d === "object")
        .map((d) => d.url);
      
      return {
        status: true,
        data: { images: images },
      };
    } catch (e) {
      return {
        status: false,
        message: e.message,
      };
    }
  }
  
  function string(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  