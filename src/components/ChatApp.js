import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  List,
  ListItem,
  Text,
  Flex
} from '@chakra-ui/react';
import socket from '../socket';
import UsersList from './UsersList';
import MessageForm from './MessageForm';

const ChatApp = ({ user, room }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', { room, user });

    const handleInit = ({ users }) => {
      setUsers(users);
    };

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserJoin = (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const handleUserLeave = (leftUser) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u !== leftUser));
    };

    socket.on('init', handleInit);
    socket.on('send:message', handleReceiveMessage);
    socket.on('user:join', handleUserJoin);
    socket.on('user:left', handleUserLeave);

    return () => {
      socket.emit('leaveRoom', { room, user });
      socket.off('init', handleInit);
      socket.off('send:message', handleReceiveMessage);
      socket.off('user:join', handleUserJoin);
      socket.off('user:left', handleUserLeave);
    };
  }, [room, user]);

  const handleMessageSubmit = (message) => {
    socket.emit('send:message', { room, user, text: message.text });
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Flex p={4} maxW="md" borderWidth={1} borderRadius="lg" overflow="hidden" flexDirection="column">
      <Heading as="h2" size="lg" mb={4}>Room: {room}</Heading>
      <Flex flexDirection="row" mb={4}>
        <Box flex="1">
          <UsersList users={users} />
        </Box>
        <Box flex="2">
          <VStack spacing={4} align="stretch">
            <List spacing={2} maxH="300px" overflowY="scroll">
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <Text><strong>{message.user}:</strong> {message.text}</Text>
                </ListItem>
              ))}
            </List>
            <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatApp;
