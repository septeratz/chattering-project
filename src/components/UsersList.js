import React from 'react';
import { Box, Heading, UnorderedList, ListItem } from '@chakra-ui/react';

const UsersList = ({ users }) => (
  <Box>
    <Heading as="h3" size= "md" mb={4}>참여자들</Heading>
    <UnorderedList>
      {users.map((user, i) => (
        <ListItem key={i}>{user}</ListItem>
      ))}
    </UnorderedList>
  </Box>
);

export default UsersList;
