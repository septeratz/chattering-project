import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
} from '@chakra-ui/react';

const SignUp = ({ toggleSignUp }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/signup', { id, password });
      setSuccess('Account created successfully! Please log in.');
      setError('');
    } catch (err) {
      setError('User already exists');
      setSuccess('');
    }
  };

  return (
    <Box p={4} maxW="md" borderWidth={1} borderRadius="lg" overflow="hidden">
      <Heading as="h2" size="lg" mb={4}>Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="id" mb={4}>
          <FormLabel>ID</FormLabel>
          <Input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" mb={4}>Sign Up</Button>
        {error && <Text color="red.500">{error}</Text>}
        {success && <Text color="green.500">{success}</Text>}
      </form>
      <Button onClick={toggleSignUp} variant="link" colorScheme="teal">
        Back to Login
      </Button>
    </Box>
  );
};

export default SignUp;
