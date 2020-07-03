require("dotenv").config();

const http = require("http");

const app = require("./app/app");

const port = process.env.SERVER_PORT;

const server = http.createServer(app);

server.listen(port, () => {
  console.clear();
  console.log(`Server started on port ${port}`);
});