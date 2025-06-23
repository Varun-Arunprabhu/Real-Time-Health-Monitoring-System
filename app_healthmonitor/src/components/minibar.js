import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 70;

export default function Minibar() {
  const navigate = useNavigate();
  const handleGoals = () => {
    navigate('/goals');
  };
  const handlechat =() => {
    navigate('/chat')
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor:'white',
            borderColor:'white'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List sx={{paddingRight:0, paddingLeft:0.7, paddingTop:2}}>
        <img src="logo4.png" alt='logo' style={{width:55, height:55, paddingLeft:0}}></img><br/><br/><br/>
            <Button onClick={handleGoals}><AddCircleRoundedIcon style={{fontSize:30}} /> </Button><br/><br/>
            <Button><HomeRoundedIcon style={{fontSize:30}}/></Button> <br/><br/>
            <Button onClick={handlechat}><ScienceRoundedIcon style={{fontSize:30}} /></Button>
        </List>
      </Drawer>
    </Box>
  );
}