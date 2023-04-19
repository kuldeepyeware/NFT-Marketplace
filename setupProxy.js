const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "https://gateway.pinata.cloud/ipfs",
      changeOrigin: true,
    })
  );
};
