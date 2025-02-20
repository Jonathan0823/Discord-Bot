function splitMessage(message, maxLength = 2000) {
  if (message.length <= maxLength) {
    return [message];
  }

  const messages = [];
  let currentMessage = "";

  const lines = message.split("\n");

  for (const line of lines) {
    if ((currentMessage + "\n" + line).length > maxLength) {
      messages.push(currentMessage.trim());
      currentMessage = "";
    }

    currentMessage += (currentMessage ? "\n" : "") + line;
  }

  if (currentMessage) {
    messages.push(currentMessage.trim());
  }

  return messages;
}

module.exports = splitMessage;
