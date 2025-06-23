import * as React from 'react'
import BasicGrid from './quickview';
import PulseRateChart from './heartrate';
import ThermalRateChart from './thermal';
import OxygenRateChart from './spO2';
import PermanentDrawerRight from './sidebar';
import Minibar from './minibar';

const Home = () => {
  return (
    <div className="App" style={{backgroundColor:'rgb(250, 250, 250)'}}>
      <PermanentDrawerRight />
      <Minibar />
      <p style={{paddingLeft:100, fontSize:15, color:'gray',paddingTop:2, paddingBottom:0}}>
        Good Morning <br/>
        <b style={{fontSize:20, color:'black'}}>Welcome Back 🎉</b>
      </p>
      <span style={{paddingLeft:550, fontSize:10, color:'gray'}}>Q &nbsp;&nbsp;&nbsp;&nbsp; U &nbsp;&nbsp;&nbsp;&nbsp; I &nbsp;&nbsp;&nbsp;&nbsp; 
        C &nbsp;&nbsp;&nbsp;&nbsp; K &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  V &nbsp;&nbsp;&nbsp;&nbsp; I &nbsp;&nbsp;&nbsp;&nbsp; E 
        &nbsp;&nbsp;&nbsp;&nbsp; W</span>
      <BasicGrid />
      <span style={{paddingLeft:580, fontSize:10, color:'gray'}}>A &nbsp;&nbsp;&nbsp;&nbsp; N &nbsp;&nbsp;&nbsp;&nbsp; A &nbsp;&nbsp;&nbsp;&nbsp; 
        L &nbsp;&nbsp;&nbsp;&nbsp; Y &nbsp;&nbsp;&nbsp;&nbsp; S &nbsp;&nbsp;&nbsp;&nbsp; I &nbsp;&nbsp;&nbsp;&nbsp; S</span><br/>
      <table style={{paddingLeft:90, paddingBottom:10}}>
        <tr>
          <td><PulseRateChart /></td>
          <td><ThermalRateChart /></td>
          <td><OxygenRateChart /></td>
        </tr>
      </table>
    </div>
  );
}

export default Home;