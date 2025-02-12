function splitMessage(message, maxLength = 2000) {
  // If the message is already short enough, return it as-is
  if (message.length <= maxLength) {
    return [message];
  }

  const messages = [];
  let currentMessage = "";

  // Split the message into lines to preserve code block formatting
  const lines = message.split("\n");

  for (const line of lines) {
    // If adding this line would exceed the max length, start a new message
    if ((currentMessage + "\n" + line).length > maxLength) {
      messages.push(currentMessage.trim());
      currentMessage = "";
    }

    // Add the line to the current message
    currentMessage += (currentMessage ? "\n" : "") + line;
  }

  // Add the last message if it's not empty
  if (currentMessage) {
    messages.push(currentMessage.trim());
  }

  return messages;
}

module.exports = splitMessage;
