import React from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import Message from './Message';

const MessageList = ({ messages }) => (
  <Box>
    <Heading as="h2" size="lg" mb={4}>채팅방</Heading>
    <VStack spacing={4} align="stretch">
      {messages.map((message, i) => (
        <Message key={i} user={message.user} text={message.text} />
      ))}
    </VStack>
  </Box>
);

export default MessageList;
