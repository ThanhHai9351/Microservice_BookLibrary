const { registerCustomer, loginCustomer } = require("./auth.controller");

const routes = (app) => {
  app.post("/register", registerCustomer);
  app.post("/login", loginCustomer);

  app.get("/status", (res) => {
    res.send("Port is active!");
  });
};

module.exports = routes;
