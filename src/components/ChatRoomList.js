import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  List,
  ListItem,
  VStack,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import socket from '../socket';

const ChatRoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const fetchRooms = () => {
      socket.emit('requestRoomList');
      socket.on('roomList', (rooms) => {
        setRooms(rooms);
      });
    };

    fetchRooms();

    return () => {
      socket.off('roomList');
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRooms = rooms.filter(room =>
    room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit('createRoom', { name: newRoomName });
      setNewRoomName('');
      setSearchQuery(''); // Clear search query after creating a room
    }
  };

  return (
    <Box p={4} maxW="md" borderWidth={1} borderRadius="lg" overflow="hidden">
      <Heading as="h2" size="lg" mb={4}>Chat Rooms</Heading>
      <FormControl mb={4}>
        <Input
          placeholder='Search for a room'
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </FormControl>
      {filteredRooms.length === 0 ? (
        <Text>No rooms found. You can create a new room.</Text>
      ) : (
        <List spacing={2} mb={4}>
          {filteredRooms.map((room, index) => (
            <ListItem key={index}>
              <Button width="100%" onClick={() => onSelectRoom(room)}>{room}</Button>
            </ListItem>
          ))}
        </List>
      )}
      {filteredRooms.length === 0 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="newRoom">
            <FormLabel>Create New Room</FormLabel>
            <Input
              placeholder='Room Name'
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <Button mt={2} colorScheme="teal" onClick={handleCreateRoom}>Create Room</Button>
          </FormControl>
        </VStack>
      )}
    </Box>
  );
};

export default ChatRoomList;
