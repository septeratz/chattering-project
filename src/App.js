import React, { useState, useEffect } from 'react';
import socket from './socket';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoomList from './components/ChatRoomList';
import ChatApp from './components/ChatApp';

const App = () => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Fetch the initial room list and update on any room changes
    socket.on('roomList', (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.off('roomList');
    };
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    socket.emit('requestRoomList');
  };

  const handleSignUp = (username, password) => {
    setUser(username);
    socket.emit('requestRoomList');
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    socket.emit('joinRoom', { room, user });
  };

  const handleCreateRoom = (roomName) => {
    const newRoom = { name: roomName };
    socket.emit('createRoom', newRoom);
    setSelectedRoom(roomName);
    socket.emit('joinRoom', { room: roomName, user });
  };

  if (!user) {
    return isSignUp ? (
      <SignUp onSignUp={handleSignUp} />
    ) : (
      <Login onLogin={handleLogin} />
    );
  }

  if (!selectedRoom) {
    return (
      <ChatRoomList
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
      />
    );
  }

  return <ChatApp user={user} room={selectedRoom} />;
};

export default App;
