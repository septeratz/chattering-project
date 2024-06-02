import React, { useState } from 'react';
import { ChakraProvider, Box, Center } from '@chakra-ui/react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoomList from './components/ChatRoomList';
import ChatApp from './components/ChatApp';

const App = () => {
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleSignUpToggle = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  if (!user) {
    return (
      <ChakraProvider>
        <Center height="100vh">
        <Box>
          {isSignUp ? (
            <SignUp toggleSignUp={handleSignUpToggle} />
          ) : (
            <Login onLogin={handleLogin} toggleSignUp={handleSignUpToggle} />
          )}
        </Box>
        </Center>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Center height="100vh">
      <Box>
        {!selectedRoom ? (
          <ChatRoomList onSelectRoom={handleSelectRoom} />
        ) : (
          <ChatApp user={user} room={selectedRoom} />
        )}
      </Box>
      </Center>
    </ChakraProvider>
  );
};

export default App;
