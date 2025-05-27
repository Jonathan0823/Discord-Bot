const getUserName = (message) => {
  const user =
    message.author.username === "lynz727wysi"
      ? "Eguin"
      : message.author.username === "nothing.25"
        ? "Nigga"
        : message.author.username === "vel740"
          ? "Revel"
          : message.author.username === "zerojuice"
            ? "Eric"
            : message.author.globalName;

  return user;
};

export default getUserName;
