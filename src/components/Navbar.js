import React, { useState } from 'react';
import '../App.css';

const Navbar = ({ user, onProfileClick, isProfileVisible }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletData, setWalletData] = useState({ amount: '', walletAddress: '' });
  const userId = user.id;
  const backendAPI = "https://bitcoin-mania-backend.onrender.com";

  // console.log("Navbar.js ==> user: ", user)

  const handleWalletClick = () => {
    setShowWalletModal(true);
  };

  const handleChange = (e) => {
    setWalletData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const closeModal = () => {
    setShowWalletModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Submitted Wallet Data:', walletData);
    try {
      // const res = await fetch('http://localhost:5000/api/mining/withdraw', {
      const res = await fetch(`${backendAPI}/api/mining/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Optional if you're using cookies
        body: JSON.stringify({
          userId, // make sure this is defined
          amount: parseFloat(walletData.amount),
          walletAddress: walletData.walletAddress,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(`Withdrawal successful! New balance: ${data.balance}`);
      } else {
        alert(data.message || 'Withdrawal failed');
      }
    } catch (err) {
      console.error('Error during withdrawal:', err);
      alert('Server error during withdrawal.');
    } finally {
      setShowWalletModal(false);
    }
  };

  return (
    <>
    <nav className="navbar">
      <h3>Bitcoin Mania</h3>
      <div>
        <i className="fa-solid fa-wallet" onClick={handleWalletClick}></i>
        {isProfileVisible ? <i className="fa-solid fa-circle-xmark" onClick={onProfileClick} style={{ cursor: 'pointer' }}></i> : <i className="fa-solid fa-user" onClick={onProfileClick} style={{ cursor: 'pointer' }}></i>}
      </div>
    </nav>

    {showWalletModal && (
      <div className="wallet-modal">
        <div className="wallet-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h4>Transfer Amount</h4>
          <form onSubmit={handleSubmit}>
            <input type="number" name="amount" placeholder="Enter Amount" value={walletData.amount} onChange={handleChange} required />
            <input type="text" name="walletAddress" placeholder="Wallet Address" value={walletData.walletAddress} onChange={handleChange} required />
            <button type="submit">Submit</button>
            <p className="withdraw-info">
              <strong>Minimum withdrawal:</strong> 0.0005 BTC <br />
              <strong>Maximum withdrawal:</strong> 1 BTC <br />
              <strong>Network Fee:</strong> 0.0001 BTC per transaction
            </p>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
