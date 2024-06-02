import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Message = ({ user, text }) => (
  <Box>
    <Text>
      <strong>{user}:</strong> {text}
    </Text>
  </Box>
);

export default Message;
