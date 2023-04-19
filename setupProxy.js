const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/pinning",
    createProxyMiddleware({
      target: "https://api.pinata.cloud",
      changeOrigin: true,
    })
  );
};
