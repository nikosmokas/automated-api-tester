const axios = require("axios");

// Simulated function to perform availability check
const performAvailabilityCheck = async (url) => {
  try {
    const response = await axios.get(url);
    return response.status === 200 ? "available" : "not available";
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return "Bad Request";
        case 401:
          return "Unauthorized";
        case 403:
          return "Forbidden";
        case 404:
          return "Not Found";
        case 500:
          return "Internal Server Error";
        case 502:
          return "Bad Gateway";
        case 503:
          return "Service Unavailable";
        default:
          return "Error";
      }
    }
    return "Error";
  }
};

module.exports = performAvailabilityCheck;
