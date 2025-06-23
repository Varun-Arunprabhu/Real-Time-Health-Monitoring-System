import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState(''); // User message
  const [messages, setMessages] = useState([]); // Messages array to store conversation

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty message

    // Add user message to the chat
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage(''); // Clear input field

    try {
      // Send message to Flask API
      const response = await axios.post('http://localhost:5001/chat', { message });
      
      // Add bot response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: response.data.message }
      ]);
    } catch (error) {
      console.error('Error while communicating with the server:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>AI Chatbot</Typography>

      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '60%',
                  padding: 1.5,
                  borderRadius: 2,
                  backgroundColor: msg.role === 'user' ? '#1976d2' : '#f1f1f1',
                  color: msg.role === 'user' ? 'white' : 'black',
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', padding: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // Send on "Enter"
          sx={{ marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;