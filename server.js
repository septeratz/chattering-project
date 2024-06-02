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

var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  var get = function () {
    var res = [];
    for (let user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

io.on('connection', (socket) => {
  console.log('A user connected');

  var name = userNames.getGuestName();

  socket.on('joinRoom', ({ room, user }) => {
    if (!rooms[room]) {
      rooms[room] = { users: [], messages: [] };
    }

    if (!rooms[room].users.includes(user)) {
      rooms[room].users.push(user);
      socket.join(room);
      socket.emit('init', { users: rooms[room].users, messages: rooms[room].messages, name: user });
      io.to(room).emit('user:join', user);
      console.log(`${user} joined room: ${room}`);
    }
  });

  socket.on('createRoom', (room) => {
    if (!rooms[room.name]) {
      rooms[room.name] = { users: [], messages: [] };
      io.emit('roomList', Object.keys(rooms));
      console.log(`Room created: ${room.name}`);
    }
  });

  socket.on('leaveRoom', ({ room, user }) => {
    if (rooms[room]) {
      rooms[room].users = rooms[room].users.filter((u) => u !== user);
      io.to(room).emit('user:left', user);
      console.log(`${user} left room: ${room}`);
    }
    socket.leave(room);
  });

  socket.on('send:message', ({ room, user, text }) => {
    const message = { user, text };
    if (rooms[room]) {
      rooms[room].messages.push(message);
      io.to(room).emit('send:message', message);
      console.log(`Message from ${user} in room ${room}: ${text}`);
    }
  });

  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);
      name = data.name;
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });
      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('disconnect', function () {
    for (let room in rooms) {
      if (rooms[room].users.includes(name)) {
        rooms[room].users = rooms[room].users.filter((u) => u !== name);
        io.to(room).emit('user:left', name);
      }
    }
    userNames.free(name);
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Listening on port 3001');
});
