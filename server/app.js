const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { Server } = require("socket.io");
const { connect, getDb } = require("./config/mongoConnection");
const { ObjectId } = require("mongodb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//? handler for UI in client
app.post("/login", async (req, res) => {
  try {
    if (!req.body.username)
      return res.status(400).json({ message: "You must provide username" });
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ message: "Invalid Username" });
    res.json({ message: "Successfully login", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const db = await getDb();
    const users = await db
      .collection("users")
      .find({ username: { $ne: req.headers.username } })
      .toArray();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const db = await getDb();
    const rooms = await db
      .collection("rooms")
      .find({ users: { $elemMatch: { username: req.headers.username } } })
      .toArray();
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/rooms/:id", async (req, res) => {
  try {
    const db = await getDb();
    const room = await db
      .collection("rooms")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/rooms", async (req, res) => {
  try {
    const db = await getDb();
    const user1 = await db
      .collection("users")
      .findOne({ username: req.headers.username });
    const user2 = await db
      .collection("users")
      .findOne({ username: req.body.username });
    const room = await db.collection("rooms").findOneAndUpdate(
      {
        $and: [
          { users: { $elemMatch: { username: user1.username } } },
          { users: { $elemMatch: { username: user2.username } } },
        ],
      },
      {
        $set: { users: [user1, user2] },
      },
      {
        upsert: true,
        returnNewDocument: true,
        returnDocument: "after",
      }
    );
    res.json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//? creating server instance to be used by socket.io
const server = app.listen(port, () => {
  //? connect mongodb
  connect().then(() => {
    console.log(`Example app listening on port ${port}`);
  });
});

//? creating socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//? handler for socket.io
io.on("connection", async (socket) => {
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  // room with db
  socket.on("JOIN_ROOM_CHAT", (roomId) => {
    socket.join(roomId);

    socket.on("SEND_MSG_TO_ROOM", async (message, sender, receiver, time) => {
      const db = await getDb();
      await db.collection("rooms").findOneAndUpdate(
        {
          $and: [
            { users: { $elemMatch: { username: sender } } },
            { users: { $elemMatch: { username: receiver } } },
          ],
        },
        {
          $push: { messages: { message, sender, receiver, time } },
        }
      );
      io.in(roomId).emit("SEND_MSG_CLIENT_ROOM", { message, sender, time });
    });

    socket.on("TYPE_MSG_TO_ROOM", () => {
      socket.to(roomId).emit("SEND_TYPING_CLIENT_ROOM", true);
    });
    socket.on("TYPE_STOP_MSG_TO_ROOM", () => {
      socket.to(roomId).emit("SEND_TYPING_STOP_CLIENT_ROOM", false);
    });
  });

  // broadcast example
  socket.on("SEND_MSG_SERVER", (message) => {
    socket.emit("SEND_MSG_CLIENT", message);
  });
});
