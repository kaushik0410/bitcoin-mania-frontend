import React from 'react';
import MiningPanel from './MiningPanel';
import '../App.css';

const Dashboard = ({ user }) => {
  // console.log("user: " + user)
  // console.log("id: " + user.id)
  // console.log("_id: " + user._id)
  // console.log("username: " + user.username)
  return (
    <div className="dashboard" style={{padding: '20px'}}>
      <div className="dashboard-content">
        <MiningPanel user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
