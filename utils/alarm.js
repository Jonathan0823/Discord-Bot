const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const cron = require("node-cron");

function setupDailyAlarm(client, channelId) {
  cron.schedule(
    "0 6 * * *",
    () => {
      triggerAlarm(client, channelId);
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
}

function triggerAlarm(client, channelId) {
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    const button = new ButtonBuilder()
      .setLabel("Check-in Hoyolab!")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=e202303301540311&bbs_auth_required=true&bbs_presentation_style=fullscreen&lang=en-us&utm_source=share&utm_medium=link&utm_campaign=web"
      );

    const row = new ActionRowBuilder().addComponents(button);

    const embed = new EmbedBuilder()
      .setColor(0xffc0cb)
      .setTitle("Check In Yuk!")
      .setDescription(
        "Pagii!! Jangan lupa sarapan dan check-in Hoyolab kamu ya~ 🍞☕"
      )
      .setThumbnail(
        "https://play-lh.googleusercontent.com/azVwh1OazZcsq6ocxOzH4mccFgs3IP0-RTxlFsoIumIO28RbmNx2YP7PEsqNAyY0ck0=w240-h480-rw"
      )
      .setFooter("Hari ini semangat ya! 💪")
      .setImage(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCLqlemXM4g15lAmQK4Fq-CML4MhsBh8fQDw&s"
      );

    channel.send({ embeds: [embed], components: [row] });
z  } else {
    console.error(`Channel with ID ${channelId} not found.`);
  }
}

module.exports = {
  setupDailyAlarm,
};
