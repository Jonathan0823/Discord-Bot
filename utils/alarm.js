const { EmbedBuilder } = require('discord.js');

// alarm.js
function calculateTimeUntilNext6AM() {
  const now = new Date();
  const next6AM = new Date();

  next6AM.setHours(6, 0, 0, 0); // Set time to 6:00 AM today

  if (now >= next6AM) {
    // If it's already past 6 AM, set to tomorrow
    next6AM.setDate(next6AM.getDate() + 1);
  }

  return next6AM.getTime() - now.getTime();
}

function setupDailyAlarm(client, channelId) {
  const delay = calculateTimeUntilNext6AM();

  setTimeout(() => {
    // Trigger alarm initially at 6 AM
    triggerAlarm(client, channelId);

    // Schedule to repeat every 24 hours
    setInterval(() => triggerAlarm(client, channelId), 1000 * 60 * 60 * 24); // 24 hours
  }, delay);
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

    channel.send({ embeds: [embed] });
  } else {
    console.error(`Channel with ID ${channelId} not found.`);
  }
}

module.exports = {
  setupDailyAlarm,
};
