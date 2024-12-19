const { EmbedBuilder } = require("discord.js");
const CronJob = require("node-cron");


function setupDailyAlarm(client, channelId) {
  const job = new CronJob("0 8 * * *", () => {
    triggerAlarm(client, channelId);
  }, null, true, "Asia/Jakarta");
  job.start();
}

function triggerAlarm(client, channelId) {
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    const embed = new EmbedBuilder()
      .setColor(0xffc0cb) // Example: Pink color
      .setTitle("Check In Yuk!")
      .setDescription(
        "Pagii!! Jangan lupa sarapan dan check-in [hoyolab](https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=e202303301540311&bbs_auth_required=true&bbs_presentation_style=fullscreen&lang=en-us&utm_source=share&utm_medium=link&utm_campaign=web) kamu ya~ 🍞☕"
      )
      .setThumbnail(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCLqlemXM4g15lAmQK4Fq-CML4MhsBh8fQDw&s"
      );

    channel.send({ embeds: [embed] });
  } else {
    console.error(`Channel with ID ${channelId} not found.`);
  }
}

module.exports = {
  setupDailyAlarm,
};
