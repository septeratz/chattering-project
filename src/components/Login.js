import React, { useState } from 'react';
import axios from 'axios';
import {  Box,  Button,  FormControl,  FormLabel,  Input,  Heading,  Text,
} from '@chakra-ui/react';

const Login = ({ onLogin, toggleSignUp }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/login', { id, password });
      onLogin(id);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box p={8} maxW="lg" borderWidth={1} borderRadius="lg" overflow="hidden">
      <Heading as="h2" size="xl" mb={6}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="id" mb={6}>
          <FormLabel fontSize="lg">ID</FormLabel>
          <Input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            size="lg"
          />
        </FormControl>
        <FormControl id="password" mb={6}>
          <FormLabel fontSize="lg">Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" size="lg" mb={4}>Login</Button>
        {error && <Text color="red.500" fontSize="lg">{error}</Text>}
      </form>
      <Button onClick={toggleSignUp} variant="link" colorScheme="teal" size="lg">
        Sign Up
      </Button>
    </Box>
  );
};


export default Login;
