import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const ImageUpload = ({ setImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Button variant="contained" component="label">
      Choose Image
      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
    </Button>
  );
};

const Signup2 = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        email,
        username,
        weight,
        height,
        age,
        location,
        password,
        profilePicture: image,
      });
      alert(response.data);
      navigate('/');
    } catch (error) {
      alert('Error: ' + error.response?.data || error.message);
    }
  };

  return (
    <div className='loginpage'>
      <div className='overlay2'>
        <Box component="form" sx={{ '& > :not(style)': { m: 0.5, width: '43ch' } }} noValidate autoComplete="off">
          <img src="./elements/logo5.png" alt="logo" style={{ width: 70, height: 70 }} />
          <br /><br />
          <h2>Sign Up</h2>
          <h5>Create your account</h5>
          <Divider />
          <br /><br />
          <TextField label="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
          <table>
            <tbody>
              <tr>
                <td><TextField label="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} /></td>
                <td><TextField label="Height" value={height} onChange={(e) => setHeight(e.target.value)} /></td>
                <td><TextField label="Age" value={age} onChange={(e) => setAge(e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
          <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <ImageUpload setImage={setImage} /><br/><br/>
          <Button variant="contained" style={{ borderRadius: 50, backgroundColor: 'rgb(155,1,73)' }} onClick={handleSignup}>
            Sign Up
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Signup2;