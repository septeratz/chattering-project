const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());  // Add this line to use CORS with default settings

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Specify the origin of the frontend
    methods: ["GET", "POST"]
  }
});

let rooms = {};

// Keep track of which names are used so that there are no duplicates
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

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
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

  // Send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // Notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // Send the current room list to the new connection
  socket.emit('roomList', Object.keys(rooms));

  // Handle room creation
  socket.on('createRoom', (room) => {
    if (!rooms[room.name]) {
      rooms[room.name] = { users: [], messages: [] };
      io.emit('roomList', Object.keys(rooms));
      console.log(`Room created: ${room.name}`);
    }
  });

  // Handle joining a room
  socket.on('joinRoom', ({ room, user }) => {
    socket.join(room);
    if (rooms[room]) {
      rooms[room].users.push(user);
      socket.emit('init', { users: rooms[room].users, messages: rooms[room].messages, name: user });
      io.to(room).emit('user:join', user);
    }
    console.log(`${user} joined room: ${room}`);
  });

  // Handle leaving a room
  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room);
    if (rooms[room]) {
      rooms[room].users = rooms[room].users.filter((u) => u !== user);
      io.to(room).emit('user:left', user);
    }
    console.log(`${user} left room: ${room}`);
  });

  // Handle sending a message
  socket.on('send:message', ({ room, user, text }) => {
    const message = { user, text };
    if (rooms[room]) {
      rooms[room].messages.push(message);
      io.to(room).emit('send:message', message);
    }
    console.log(`Message from ${user} in room ${room}: ${text}`);
  });

  // Validate a user's name change, and broadcast it on success
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

  // Clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
});

server.listen(3001, () => {
  console.log('Listening on port 3001');
});
