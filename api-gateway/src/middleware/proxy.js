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
    timeout: 100,
    proxyTimeout: 100,
    pathRewrite: {
      [`^/api/${serviceName}`]: "",
    },
    onError: (err, req, res) => {
      console.error(err);
      if (err.code === "ECONNRESET") {
        console.log("Connection reset by peer");
        if (!res.headersSent) {
          res.writeHead(502, {
            "Content-Type": "text/plain",
          });
          res.end("Connection to upstream server failed");
        }
      } else {
        res.status(500).json({
          message: `Error connecting to ${serviceName} service`,
          error: err.message,
        });
      }
    },
  });
};

module.exports = {
  createServiceProxy,
};
