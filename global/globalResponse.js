const GlobalResponseData = (status, message, data) => {
  return { status, message, data };
};

const GlobalResponse = (status, message) => {
  return { status, message };
};

module.exports = { GlobalResponseData, GlobalResponse };
