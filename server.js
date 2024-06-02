const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let users = {};
let rooms = {};
let roomMessages = {}; // Store messages for each room

app.post('/signup', (req, res) => {
  const { id, password } = req.body;
  if (users[id]) {
    return res.status(400).send('User already exists');
  }
  users[id] = { id, password };
  res.status(201).send('User created');
});

app.post('/login', (req, res) => {
  const { id, password } = req.body;
  const user = users[id];
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }
  res.status(200).send('Login successful');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('requestRoomList', () => {
    io.emit('roomList', Object.keys(rooms));
  });

  socket.on('createRoom', ({ name }) => {
    if (!rooms[name]) {
      rooms[name] = [];
      roomMessages[name] = []; // Initialize message array for new room
      io.emit('roomList', Object.keys(rooms));
    }
  });

  socket.on('joinRoom', ({ room, user }) => {
    if (!rooms[room]) {
      rooms[room] = [];
    }
    if (!rooms[room].includes(user)) {
      rooms[room].push(user);
      socket.join(room);
      io.to(room).emit('user:join', user);
      io.to(room).emit('init', { users: rooms[room] });
    }
  });

  socket.on('leaveRoom', ({ room, user }) => {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u !== user);
      io.to(room).emit('user:left', user);
    }
    socket.leave(room);
  });

  socket.on('send:message', ({ room, user, text }) => {
    const message = { user, text };
    if (rooms[room]) {
      roomMessages[room].push(message);
      io.to(room).emit('send:message', message);
    }
  });

  socket.on('requestLatestMessage', (room) => {
    const latestMessage = roomMessages[room] ? roomMessages[room][roomMessages[room].length - 1] : null;
    socket.emit('latestMessage', { room, message: latestMessage });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Listening on port 3001');
});
