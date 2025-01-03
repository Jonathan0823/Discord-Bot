const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const cron = require("node-cron");

function setupDailyAlarm(client, channelId) {
  console.log("Setting up daily alarm for " + channelId);
  cron.schedule(
    "0 4 * * *",
    async () => {
      await triggerAlarm(client, channelId);
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
}

async function triggerAlarm(client, channelId) {
  if (!Array.isArray(channelId)) {
    console.error("channelId must be an array of IDs.");
    return;
  }

  for (const id of channelId) {
    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    const channel = await client.channels.fetch(id);
    if (!channel) {
      console.error(`Channel with ID ${id} not found.`);
      return;
    }

    if (!channel.isTextBased() || !channel.viewable) {
      console.error(`Bot does not have access to channel: ${id}`);
      continue;
    }

    while (attempts < maxRetries && !success) {
      try {
        const button1 = new ButtonBuilder()
          .setEmoji("<:genshinimpact:1324355501466849331> ")
          .setLabel("GI ")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&hyl_auth_required=true&hyl_presentation_style=fullscreen&utm_source=share&utm_medium=link&utm_campaign=web"
          );

        const button2 = new ButtonBuilder()
          .setEmoji("<:hsr:1324355673567395921> ")
          .setLabel("HSR")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://act.hoyolab.com/bbs/event/signin/hkrpg/e202303301540311.html?act_id=e202303301540311&bbs_auth_required=true&bbs_presentation_style=fullscreen&lang=en-us&utm_source=share&utm_medium=link&utm_campaign=web"
          );

        const button3 = new ButtonBuilder()
          .setEmoji("<:zenless:1324356078825377932> ")
          .setLabel("ZZZ")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://act.hoyolab.com/bbs/event/signin/zzz/e202406031448091.html?act_id=e202406031448091&bbs_auth_required=true&bbs_presentation_style=fullscreen&lang=en-us&utm_source=share&utm_medium=link&utm_campaign=web"
          );

        const row = new ActionRowBuilder().addComponents(
          button1,
          button2,
          button3
        );

        const embed = new EmbedBuilder()
          .setColor(0xffc0cb)
          .setTitle("Check In Yuk!")
          .setDescription(
            "Pagii!! Jangan lupa sarapan dan check-in Hoyolab kamu ya~ 🍞☕"
          )
          .setThumbnail(
            "https://play-lh.googleusercontent.com/azVwh1OazZcsq6ocxOzH4mccFgs3IP0-RTxlFsoIumIO28RbmNx2YP7PEsqNAyY0ck0=w240-h480-rw"
          )
          .setImage(
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCLqlemXM4g15lAmQK4Fq-CML4MhsBh8fQDw&s"
          )
          .setFooter({ text: "Hari ini semangat ya! 💪" });

        await channel.send({ embeds: [embed], components: [row] });
        success = true; // Mark as success if the operation completes without error
        console.log(
          `Alarm sent successfully! (retry = ${attempts}, clientId = ${id})`
        );
      } catch (error) {
        attempts++;
        console.log(
          `Error sending alarm (attempt ${attempts}/${maxRetries}):`,
          error
        );

        if (attempts >= maxRetries) {
          console.log("Failed to send alarm after maximum retries.");
        }
      }
    }
  }
}

module.exports = {
  setupDailyAlarm,
  triggerAlarm,
};
