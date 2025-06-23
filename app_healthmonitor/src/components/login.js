import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      alert(response.data);
      navigate('/home');
    } catch (error) {
      alert('Error: ' + (error.response?.data || error.message));
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className='loginpage'>
      <div className='overlay2'>
        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '43ch' } }} noValidate autoComplete="off">
          <img src="./elements/logo5.png" alt='logo' style={{width:70, height:70}}></img><br></br><br></br>
          <h2>Welcome back !</h2>
          <h5>Log in to get unlimited access to data and information</h5><br></br><br></br>
          <h5>Email</h5>
          <TextField label="Enter your mail address" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <h5>Password</h5>
          <TextField label="Enter password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth /><br/><br/>
          <Button variant="contained" style={{ borderRadius: 50, backgroundColor: 'rgb(155,1,73)' }} onClick={handleLogin}>
            Sign In
          </Button><br/><br/>
          <Divider color="white">or</Divider><br/>
          <h4 style={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Button variant="contained" size="small" onClick={handleSignupRedirect} style={{ backgroundColor: 'rgb(155,1,73)' }}>
              Sign Up
            </Button>
          </h4>
        </Box>
      </div>
    </div>
  );
};

export default Login1;