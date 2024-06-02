import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import socket from '../socket';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    socket.on('init', ({ users, name }) => {
      setUsers(users);
      setUser(name);
    });
    socket.on('send:message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on('user:join', (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });
    socket.on('user:left', (user) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u !== user));
    });
    socket.on('change:name', ({ oldName, newName }) => {
      setUsers((prevUsers) => prevUsers.map((user) => (user === oldName ? newName : user)));
    });

    return () => {
      socket.off('init');
      socket.off('send:message');
      socket.off('user:join');
      socket.off('user:left');
      socket.off('change:name');
    };
  }, []);

  const handleMessageSubmit = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit('send:message', message);
  };


  return (
    <Box>
      <UsersList users={users} />
      <MessageList messages={messages} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
    </Box>
  );
};

export default ChatApp;
