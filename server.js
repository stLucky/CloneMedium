const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "./dist",
});
const port = process.env.PORT || 3200;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
