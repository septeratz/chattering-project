import React, { useState, useEffect } from 'react';
import socket from '../socket';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const ChatApp = ({ user, room }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(user);

  useEffect(() => {
    socket.emit('joinRoom', { room, user: username });

    const handleInit = (data) => {
      setUsers(data.users);
      setMessages(data.messages);
      if (data.name) {
        setUsername(data.name);
      }
    };

    const handleSendMessage = (message) => {
      setMessages((messages) => [...messages, message]);
    };

    const handleUserJoin = (user) => {
      setUsers((users) => [...users, user]);
    };

    const handleUserLeft = (user) => {
      setUsers((users) => users.filter((u) => u !== user));
    };

    socket.on('init', handleInit);
    socket.on('send:message', handleSendMessage);
    socket.on('user:join', handleUserJoin);
    socket.on('user:left', handleUserLeft);

    return () => {
      socket.emit('leaveRoom', { room, user: username });
      socket.off('init', handleInit);
      socket.off('send:message', handleSendMessage);
      socket.off('user:join', handleUserJoin);
      socket.off('user:left', handleUserLeft);
    };
  }, [room, username]);

  const handleMessageSubmit = (message) => {
    socket.emit('send:message', { ...message, room });
    setMessages((messages) => [...messages, message]);
  };

  return (
    <div className='chat-app'>
      <UsersList users={users} />
      <MessageList messages={messages} />
      <MessageForm onMessageSubmit={handleMessageSubmit} user={username} />
    </div>
  );
};

export default ChatApp;
