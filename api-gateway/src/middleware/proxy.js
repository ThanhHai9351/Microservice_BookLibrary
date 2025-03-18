const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

const createServiceProxy = (serviceName) => {
  const serviceUrl = config.services[serviceName];
  if (!serviceUrl) {
    throw new Error(`Service URL not found for ${serviceName}`);
  }

  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${serviceName}`]: "",
    },
    onError: (err, req, res) => {
      console.log(err);
      res.status(500).json({
        message: `Error connecting to ${serviceName} service`,
        error: err.message,
      });
    },
  });
};

module.exports = {
  createServiceProxy,
};
