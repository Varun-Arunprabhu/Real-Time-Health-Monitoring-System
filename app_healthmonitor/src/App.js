import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import Signup from './components/signup';
import GoalSetting from './components/GoalSetting';
import Chat from './components/chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/goals" element={<GoalSetting />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;