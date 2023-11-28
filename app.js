const express = require("express");
const mysql = require("mysql");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

//Create Connection
const connection = mysql.createConnection({
  host: "192.168.1.128",
  user: "evgeny",
  password: "1234",
  database: "test",
});
// Connect
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("MySql Connected...");
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("getData", () => {
    connection.query(
      "SELECT * FROM (SELECT * FROM sensors ORDER BY id DESC LIMIT 20) t ORDER BY id",
      (error, results) => {
        if (error) {
          console.error(error.stack);
          return;
        }
        socket.emit("data", results);
      }
    );
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
server.listen("3000", () => {
  console.log("Server started on port 3000");
});
