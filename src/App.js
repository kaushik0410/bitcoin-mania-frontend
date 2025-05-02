import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';         // Adjust path as needed
import Profile from './components/Profile'; // Adjust path as needed
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Toggle profile visibility
  const handleProfileClick = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  // Update user details (you can expand this to persist changes)
  const updateUserDetails = (updatedDetails) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedDetails,
    }));
  };

  return (
    <div>
      {!user ? (
        <Login onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <>
          <Navbar user={user} onProfileClick={handleProfileClick} isProfileVisible={isProfileVisible} />
          {isProfileVisible ? (
            <Profile userDetails={user} updateUserDetails={updateUserDetails} setUser={setUser} />
          ) : (
            <Dashboard user={user} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
