import React, { useState } from 'react';
import { Box, Button, FormControl, Input } from '@chakra-ui/react';

const MessageForm = ({ user, onMessageSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = { user, text };
    onMessageSubmit(message);
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl mb={4}>
        <Input
          placeholder='메시지 입력'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </FormControl>
      <Button type="submit" colorScheme="teal">Send</Button>
    </Box>
  );
};

export default MessageForm;
