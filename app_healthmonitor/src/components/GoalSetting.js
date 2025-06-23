import React, { useState } from 'react';
import axios from 'axios';
import './GoalSetting.css';
import { useNavigate } from 'react-router-dom';


const GoalSetting = () => {
  const [dailyGoals, setDailyGoals] = useState({ steps: '', calories: '', yoga: '', meditation: '' });
  const [monthlyGoals, setMonthlyGoals] = useState({ steps: '', calories: '' });

  const handleInputChange = (e, goalType) => {
    const { name, value } = e.target;
    if (goalType === 'daily') {
      setDailyGoals({ ...dailyGoals, [name]: value });
    } else {
      setMonthlyGoals({ ...monthlyGoals, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/goals', { dailyGoals, monthlyGoals });
      alert('Goals saved successfully!' + response.data);
    } catch (error) {
      console.error('Error saving goals');
      alert('Error saving goals');
    }
  };
    const navigate = useNavigate();
    const handleclose= () => {
      navigate('/home');
    };
  return (
    <div className='Body'>
      <div className="goal-setting">
        <h2>Set Your Goals</h2>
        <form onSubmit={handleSubmit}>
          <h3>Daily Goals</h3>
          <input name="steps" type="number" placeholder="Steps" value={dailyGoals.steps} onChange={(e) => handleInputChange(e, 'daily')} />
          <input name="calories" type="number" placeholder="Calories" value={dailyGoals.calories} onChange={(e) => handleInputChange(e, 'daily')} />
          <input name="yoga" type="number" placeholder="Yoga (minutes)" value={dailyGoals.yoga} onChange={(e) => handleInputChange(e, 'daily')} />
          <input name="meditation" type="number" placeholder="Meditation (minutes)" value={dailyGoals.meditation} onChange={(e) => handleInputChange(e, 'daily')} />

          <h3>Monthly Goals</h3>
          <input name="steps" type="number" placeholder="Steps" value={monthlyGoals.steps} onChange={(e) => handleInputChange(e, 'monthly')} />
          <input name="calories" type="number" placeholder="Calories" value={monthlyGoals.calories} onChange={(e) => handleInputChange(e, 'monthly')} />

          <button type="submit">Save Goals</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button type="submit" onClick={handleclose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default GoalSetting;