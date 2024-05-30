import React, { useState, useEffect } from 'react';
import socket from '../socket';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ChangeNameForm from './ChangeNameForm';

const ChatApp = ({ user, room }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(user);

  useEffect(() => {
    socket.emit('joinRoom', { room, user: username });

    socket.on('init', (data) => {
      setUsers(data.users);
      setMessages(data.messages);
      if (data.name) {
        setUsername(data.name);
      }
    });

    socket.on('send:message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('user:join', (user) => {
      setUsers((users) => [...users, user]);
    });

    socket.on('user:left', (user) => {
      setUsers((users) => users.filter((u) => u !== user));
    });

    socket.on('change:name', ({ oldName, newName }) => {
      setUsers((users) =>
        users.map((user) => (user === oldName ? newName : user))
      );
      if (username === oldName) {
        setUsername(newName);
      }
    });

    return () => {
      socket.emit('leaveRoom', { room, user: username });
      socket.off('init');
      socket.off('send:message');
      socket.off('user:join');
      socket.off('user:left');
      socket.off('change:name');
    };
  }, [room, username]);

  const handleMessageSubmit = (message) => {
    socket.emit('send:message', { ...message, room });
    setMessages((messages) => [...messages, message]);
  };

  const handleChangeName = (newName) => {
    const oldName = username;
    socket.emit('change:name', { oldName, newName }, (result) => {
      if (!result) {
        return alert('There was an error changing your name');
      }
      setUsers((users) =>
        users.map((user) => (user === oldName ? newName : user))
      );
      setUsername(newName);
    });
  };

  return (
    <div className='chat-app'>
      <UsersList users={users} />
      <ChangeNameForm onChangeName={handleChangeName} />
      <MessageList messages={messages} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={username} />
    </div>
  );
};

export default ChatApp;
