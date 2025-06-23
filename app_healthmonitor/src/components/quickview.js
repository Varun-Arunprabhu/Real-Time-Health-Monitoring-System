import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';


import React, { useEffect, useState } from 'react';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    width:150,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'rgba(120, 209, 209)',
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: 'white',
      ...theme.applyStyles('dark', {
        backgroundColor: '#308fe8',
      }),
    },
  }));


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1.5),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

function CircularProgressWithLabel(props) {
  const [healthData, setHealthData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/health-data')
      .then(response => response.json())
      .then(data => setHealthData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100} // Full circle for the background
        sx={{
          color: 'rgb(255,255,255,0.4)', // Background color
          position: 'absolute',
        }}
        size={85} // Size of the Circular Progress
        thickness={4.5} // Adjust thickness as needed
      />
      <CircularProgress variant="determinate" {...props} size={85} thickness={4.5} style={{strokeLinecap:'round'}} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'white', fontSize:12, textAlign:'center' }}
        >
          <b>{healthData ? healthData.caloriesBurnt:''}</b><br/>
          <b>Kcal</b>
        </Typography>
      </Box>
    </Box>
  );
}

export default function BasicGrid() {
  const [healthData, setHealthData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/health-data')
      .then(response => response.json())
      .then(data => setHealthData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <Box sx={{flexGrow:0.4}}>
      <Grid container>
        <Grid item xs={6.5} style={{paddingLeft:100, paddingTop:0}}>
          <table>
            <tr>
              <td style={{padding:'20px'}}><Item style={{color:'white', backgroundColor:"rgba(53,183,183)", borderRadius: 10, fontFamily:"verdana"}}>
                <DirectionsRunIcon /> Steps
                <p><b style={{fontSize:25}}>{healthData ? healthData.steps:''}</b> Steps</p>
                <BorderLinearProgress variant="determinate" value={50} />
                <p style={{fontSize:10, textAlign:'center'}}>Goal: 10,000 steps</p>
                </Item></td>
              <td style={{padding:'20px'}}><Item style={{color:'white', backgroundColor:"rgba(247, 122, 77)", borderRadius: 10, fontFamily:"verdana"}}>
                <LocalFireDepartmentIcon /> Calories <br/><br/>
                <div style={{paddingLeft:32, paddingRight:32}}>
                <CircularProgressWithLabel color='white' value={60} />
                </div>
                </Item></td>
              <td style={{padding:'20px'}}><Item style={{color:'white', backgroundColor:"rgba(250, 91, 126)", borderRadius: 10, fontFamily:"verdana"}}>
                <MonitorHeartIcon /> HeartRate <br/>
                <div style={{paddingLeft:35, paddingRight:35}}>
                  <TimelineRoundedIcon style={{fontSize:'80'}} />
                </div>
                <b style={{fontSize:18}}>{healthData ? healthData.bpm:''}</b> Bpm
                </Item></td>
              <td style={{padding:'20px'}}><Item style={{color:'white', backgroundColor:"rgba(136, 122, 252)", borderRadius: 10, fontFamily:"verdana"}}>
                <DeviceThermostatIcon /> Temperature <br/>
                <span style={{fontSize:20, paddingLeft:6, paddingRight:5}}><b style={{fontSize:80}}>{healthData ? healthData.temperature:''}</b>°F</span>
                </Item></td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </Box>
  );
}