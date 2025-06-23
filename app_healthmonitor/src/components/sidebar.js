import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';

import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import React, { useEffect, useState } from 'react';

const drawerWidth = 300;

export default function PermanentDrawerRight() {
  const [userData, setuserData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/details')
      .then(response => response.json())
      .then(data => setuserData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const [goalData, setgoalData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/goaldetails')
      .then(response => response.json())
      .then(data => setgoalData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
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
            backgroundColor:'rgb(245, 245, 245)',
            borderColor:'rgb(245, 245, 245)'
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <List sx={{paddingRight:0, paddingLeft:3, paddingTop:1}}>
          <table>
          <tr>
        <Box component="section" sx={{ p: 1, border: '0px solid grey', borderRadius:4}}>
          <table style={{paddingBottom:10}}>
            <tr>
              <td style={{paddingRight:10, paddingLeft:0}}><Avatar alt="Varun A" src={userData ? userData.profilePicture:''} sx={{ width: 50, height: 50}} /> </td>
              <td><b>{userData ? userData.username:''}</b> <br/> {userData ? userData.location:''}</td>
            </tr>
          </table>
        </Box></tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
          <table style={{paddingLeft:5}}>
            <tr>
              <td style={{paddingRight:30}}><b>{userData ? userData.weight:''}</b>kg</td>
              <td style={{paddingRight:30}}><b>{userData ? userData.height:''}</b>ft</td>
              <td><b>{userData ? userData.age:''}</b>yrs</td>
            </tr>
            <tr>
              <td style={{paddingRight:30}}>weight</td>
              <td style={{paddingRight:30}}>height</td>
              <td>age</td>
            </tr>
          </table>
        </Box>
        </tr> <br/>
        <tr><b>Your Goals</b></tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
          <table>
            <tr>
              <td style={{paddingRight:10}}><DirectionsRunRoundedIcon style={{fontSize:30, color:'rgba(53,183,183)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Running </td>
              <td style={{paddingLeft:20}}><b>{goalData ? goalData.dailyGoals.steps:''}</b> steps</td>
            </tr>
          </table>
        </Box>
        </tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
        <table>
            <tr>
              <td style={{paddingRight:10}}><LocalFireDepartmentRoundedIcon style={{fontSize:30, color:'rgba(247, 122, 77)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Calories </td>
              <td style={{paddingLeft:40}}><b>{goalData ? goalData.dailyGoals.calories:''}</b> Kcal</td>
            </tr>
        </table>
        </Box>
        </tr>
        <tr>
        </tr><br/>
        <tr> <b>Monthly Progress</b></tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
          <table>
            <tr>
              <td style={{paddingRight:10}}><DirectionsRunRoundedIcon style={{fontSize:30, color:'rgba(53,183,183)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Running </td>
              <td style={{paddingLeft:20}}><b>{goalData ? goalData.monthlyGoals.steps:''}</b> steps</td>
            </tr>
          </table>
        </Box>
        </tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
        <table>
            <tr>
              <td style={{paddingRight:10}}><LocalFireDepartmentRoundedIcon style={{fontSize:30, color:'rgba(247, 122, 77)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Calories </td>
              <td style={{paddingLeft:40}}><b>{goalData ? goalData.monthlyGoals.calories:''}</b> Kcal</td>
            </tr>
        </table>
        </Box>
        </tr><br/>
        <tr><b>Scheduled</b></tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
          <table>
            <tr>
              <td style={{paddingRight:10}}><DirectionsRunRoundedIcon style={{fontSize:30, color:'rgba(53,183,183)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Yoga </td>
              <td style={{paddingLeft:65}}><b>{goalData ? goalData.dailyGoals.yoga:''}</b> Mins</td>
            </tr>
          </table>
        </Box>
        </tr>
        <tr>
        <Box component="section" sx={{ p: 1, border: '1px solid white', borderRadius:4, backgroundColor:'white' }}>
        <table>
            <tr>
              <td style={{paddingRight:10}}><LocalFireDepartmentRoundedIcon style={{fontSize:30, color:'rgba(247, 122, 77)', backgroundColor:'black', borderRadius:20}} /></td>
              <td> Meditation </td>
              <td style={{paddingLeft:20}}><b>{goalData ? goalData.dailyGoals.meditation:''}</b> Mins</td>
            </tr>
        </table>
        </Box>
        </tr>
        </table>
        </List>
      </Drawer>
    </Box>
  );
}