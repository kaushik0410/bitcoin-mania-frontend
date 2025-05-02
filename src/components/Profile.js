import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = ({ userDetails, updateUserDetails, setUser }) => {
  const [formData, setFormData] = useState(userDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  console.log("Form Data:", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to update details');
      }
  
      const data = await res.json();  
      console.log('User details updated:', data);
    } catch (err) {
      setError('Failed to update details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setUser(null);
  };

  const handleInvite = () => {
    const referralLink = `http://localhost:3000/signup?ref=${formData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert(`Referral link copied to clipboard:\n${referralLink}`);
  };  

  useEffect(() => {
    const fetchReferralCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/referral-count/${userDetails.referralCode}`);
        const data = await res.json();
        setReferralCount(data.count);
      } catch (err) {
        console.error("Failed to fetch referral count", err);
      }
    };
  
    if (userDetails.referralCode) {
      fetchReferralCount();
    }
  }, [userDetails.referralCode]);

  return (
    <div className="profile-page" style={{ padding: '20px' }}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input name="username" value={formData.username} readOnly />

        <label>Email:</label>
        <input name="email" value={formData.email} readOnly />

        <label>Password:</label>
        <input type='password' name="password" value={formData.password} onChange={handleChange} />

        <label>Balance:</label>
        <input name="balance" value={Number(formData.balance).toFixed(14)} readOnly />

        <label>Wallet Address:</label>
        <input name="walletAddress" value={formData.walletAddress} onChange={handleChange} />

        <button disabled={loading} type="submit" style={{ marginTop: '10px' }}>
          {loading ? 'Updating...' : 'Update Details'}
        </button>

        <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
          Logout
        </button>
        
        <label>Referral Code:</label>
        <input name="referralCode" value={formData.referralCode} readOnly />
        
        <button onClick={handleInvite} style={{ marginTop: '20px', backgroundColor: 'green', color: 'white' }}>
          Invite users
        </button>

        <label>Referred By:</label>
        <input name="referredBy" value={formData.referredBy || "N/A"} readOnly />

        <label>Users Referred:</label>
        <input value={referralCount} readOnly />

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Profile;
