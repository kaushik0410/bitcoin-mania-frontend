import React, { useState, useEffect } from 'react';
import './MiningPanel.css';
// import { AdMobRewarded } from '@react-native-firebase/admob';

const MiningPanel = ({ user }) => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [freeMining, setFreeMining] = useState(false);
  const [freeMiningUsedToday, setFreeMiningUsedToday] = useState(false);

  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [adMiningActive, setAdMiningActive] = useState(false);

  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [btcBalanceFromDb, setBtcBalanceFromDb] = useState(0);

  const [userCountry, setUserCountry] = useState('');

  const handleOpenSessionsModal = () => {
    setShowSessionsModal(true);
  };

  const handleCloseSessionsModal = () => {
    setShowSessionsModal(false);
  };

  const availableMiners = [
    { id: 1, name: 'Basic Miner', price: 9.99, currency: 'USD', speed: '0.000000000001 BTC/sec' },
    { id: 2, name: 'Advanced Miner', price: 24.99, currency: 'USD', speed: '0.0000000001 BTC/sec' },
    { id: 3, name: 'Pro Miner', price: 49.99, currency: 'USD', speed: '0.00000001 BTC/sec' },
  ];

  const handleStartFreeMining = async () => {
    if (freeMining || freeMiningUsedToday) return;

    const miningData = {
      userId: user.id,
      minerType: "Free Mining", 
      freeMiningToday: 1,
      freeMiningDate: new Date().toLocaleString()
    };

    setFreeMining(true);

    try {
      const response = await fetch("http://localhost:5000/api/mining/start-mining", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(miningData),
      });
      const data = await response.json();
      // console.log(data.message); // "Mining session started"
      setActiveSessions((prevSessions) => [...prevSessions, data.session]);
    } catch (error) {
      console.error("Error starting mining session:", error);
    }

    try {
      const response = await fetch("http://localhost:5000/api/mining/watch-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(miningData),
      });
      const data = await response.json();
      // console.log(data.message); 
      setFreeMiningUsedToday(data.freeMiningToday)
    } catch (error) {
      console.error("Error starting mining session:", error);
    }
  };

  // const showRewardedAd = () => {
  //   return new Promise((resolve, reject) => {
  //     // Simulate ad watching (replace this with actual Ad SDK code!)
  //     const userWatchedFullAd = window.confirm("Simulate: Did you watch the full ad?");
  //     if (userWatchedFullAd) {
  //       resolve();
  //     } else {
  //       reject();
  //     }
  //   });
  // };

  const showRewardedAd = () => {
    console.log("inside showRewardedAd")
    return new Promise((resolve, reject) => {
      // Simulate ad watching (replace this with actual Ad SDK code!)
      const userWatchedFullAd = window.confirm("Simulate: Did you watch the full ad?");
      console.log("userWatchedFullAd: ", userWatchedFullAd)
      
      if (userWatchedFullAd) {
        resolve();  // Resolve after the ad is shown
      } else {
        reject("User did not watch the full ad.");
      }
    });
  };  

  const handleWatchAdForMining = async () => {
    if (adsWatchedToday >= 35) {
      alert("You have reached the daily limit of 35 ads!");
      return;
    }
    console.log("before showRewardedAd")
    try {

      await showRewardedAd(); // wait for ad to complete
      // On successful ad completion

      // Load the rewarded ad
      // app id: ca-app-pub-7231546562185055~6365512037
      // ad unit id: ca-app-pub-7231546562185055/9660106829


      // await AdMobRewarded.setAdUnitID('ca-app-pub-7231546562185055/9660106829'); // Replace with your AdMob rewarded ad unit ID
      // await AdMobRewarded.load();
      // await AdMobRewarded.show();

      // await AdMobRewarded.onAdEvent(async (type) => {
      //   if (type === 'rewarded') {
      //     // User watched the full ad, so proceed with mining logic
      //     console.log("Ad successfully watched");
  
      //     // Increment the ads watched count
      //     setAdsWatchedToday(prev => prev + 1);
  
      //     // Activate the ad mining session for 24 hours
      //     setAdMiningActive(true);
      //     setTimeout(() => {
      //       setAdMiningActive(false);
      //     }, 24 * 60 * 60 * 1000); // 24 hours duration
  
      //     // Prepare mining data
      //     const miningData = {
      //       userId: user.id,
      //       minerType: "Ad Mining", // Type of miner from ad watch
      //     };
  
      //     // Start the mining session and fetch the session data
      //     const response = await fetch("http://localhost:5000/api/mining/start-mining", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(miningData),
      //     });
  
      //     const data = await response.json();
      //     // Update active mining sessions with the new session
      //     setActiveSessions((prevSessions) => [...prevSessions, data.session]);
  
      //     // Update the count of ads watched on the server
      //     await fetch("http://localhost:5000/api/mining/watch-ad", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(miningData),
      //     });
      //   }
      // });

      console.log("after showRewardedAd")
      const miningData = {
        userId: user.id,
        minerType: "Ad Mining", 
      };

      setAdsWatchedToday(prev => prev + 1);
      setAdMiningActive(true);
      setTimeout(() => {
        setAdMiningActive(false);
      }, 24 * 60 * 60 * 1000); // 24 hours

      try {
        const response = await fetch("http://localhost:5000/api/mining/start-mining", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(miningData),
        });
        const data = await response.json();
        // console.log(data.message); 
        setActiveSessions((prevSessions) => [...prevSessions, data.session]);
      } catch (error) {
        console.error("Error starting mining session:", error);
      }

      try {
        const response = await fetch("http://localhost:5000/api/mining/watch-ad", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(miningData),
        });
        const data = await response.json();
        // console.log(data.message); 
        setAdsWatchedToday(data.adsWatchedToday)
      } catch (error) {
        console.error("Error starting mining session:", error);
      }
    } catch {
      alert("You must watch the full ad to earn a mining session.");
    }
  };

  const fetchMiningSessions = async () => {
    const userId = user.id;
    // console.log("userId: ", userId)
  
    try {
      const response = await fetch(`http://localhost:5000/api/mining/mining-sessions/${userId}`);
      const data = await response.json();
      setActiveSessions(data.miningSessions); // Update state with fetched sessions
    } catch (error) {
      console.error("Error fetching mining sessions:", error);
    }
  };

  const fetchAdsWatchedCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mining/ad-mining', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      // console.log("response: ", response)
      const data = await response.json();
      // console.log("data: ", data)
      setAdsWatchedToday(data.adsWatchedToday);
    } catch (error) {
      console.error('Failed to fetch ads watched count:', error);
    }
  };

  const fetchFreeMiningCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mining/free-mining', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      // console.log("response: ", response)
      const data = await response.json();
      // console.log("data: ", data)
      // console.log("data.freeMiningToday: ", data.freeMiningToday)
      setFreeMiningUsedToday(data.freeMiningToday);
      if (data.freeMiningToday > 0) {
        setFreeMining(true);
      }
    } catch (error) {
      console.error('Failed to fetch ads watched count:', error);
    }
  };

  const adMiningCount = activeSessions.filter(session => session.minerType === 'Ad Mining').length;

  const updateBTCBalance = async (userId, minedAmount) => {
    try {
      await fetch('http://localhost:5000/api/mining/btc-mined-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, minedAmount }),
      });
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  const handlePurchase = async (miner) => {
    console.log("userCountry: ", userCountry)
    console.log("miner: ", miner)
    if (userCountry === "India") {
      initiateRazorpay(miner);
    } else {
      initiateStripe(miner);
    }
  };

  const initiateRazorpay = async (miner) => {
    const res = await fetch("http://localhost:5000/api/payment/create-razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: miner.id, name: miner.name, amount: miner.price, currency: miner.currency  })
    });
    const data = await res.json();
  
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: data.amount,
      currency: "INR",
      name: "Miner Store",
      order_id: data.orderId,
      handler: function (response) {
        alert("Payment Successful via Razorpay");
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  const initiateStripe = async (miner) => {
    const res = await fetch("http://localhost:5000/api/payment/create-stripe-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: miner.id, name: miner.name, amount: miner.price, currency: miner.currency })
    });
    const data = await res.json();
    window.location.href = data.url;
  };  
  
  useEffect(() => {
    fetchMiningSessions();
    fetchAdsWatchedCount();
    fetchFreeMiningCount();
  }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      const userId = user.id;
      // console.log("userId: ", userId)
      let miningSpeed = 0;
      if (freeMining) miningSpeed += 0.00000000000001;
      if (adMiningActive || (adMiningCount > 0)) miningSpeed = 0.0000000000001 * (freeMining ? (activeSessions.length - 1) : (activeSessions.length));
      updateBTCBalance(userId, miningSpeed);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [activeSessions]);
  

  useEffect(() => {
    const fetchBtcBalance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/mining/btc-balance?userId=${user.id}`);
        const data = await res.json();
        // console.log("data: ", data)
        // console.log("data.balance: ", data.balance)
        // console.log("typeof data.balance === 'number': ", typeof data.balance === 'number')
        if (data && typeof data.balance === 'number') {
          setBtcBalanceFromDb(data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch BTC balance", err);
      }
    };
  
    fetchBtcBalance();

    const intervalId = setInterval(fetchBtcBalance, 5000);

    return () => clearInterval(intervalId);
  }, [user.id]); 

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setUserCountry(data.country_name);
      } catch (err) {
        console.error("Location detection failed", err);
      }
    };
    detectLocation();
  }, []);
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);  
  
  return (
    <>
      <div className="mining-panel">
        <h2>Bitcoin Mining Panel</h2>
        <div className="mining-info">
          <div className="btc-mined">
            <p className="label">BTC Mined:</p>
            <p className="value">{btcBalanceFromDb.toFixed(14)}</p>
          </div>
          <div className="session-info">
            <button onClick={handleOpenSessionsModal} className="session-button">
              Active Sessions: {activeSessions.length}
            </button>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <div className="available-miners">
        <h3>Available Miners for Purchase</h3>
        <div className="miner-cards-container">
          {availableMiners.map(miner => (
            <div key={miner.id} className="miner-card">
              <h4>{miner.name}</h4>
              <p><strong>Price:</strong> {miner.price} USD</p>
              <p><strong>Speed:</strong> {miner.speed}</p>
              <button className="purchase-button" onClick={() => handlePurchase(miner)}>Purchase</button>
            </div>
          ))}
        </div>
      </div>

      <hr className="section-divider" />

      <div className="mining-sessions-container">
        <div className="free-mining-panel-card">
          <h3>🎁 Free Mining Session</h3>
          <p>Speed: <strong>0.0000000000001 BTC/sec</strong></p>
          <p>Duration: <strong>5 hours</strong></p>
          <button className="start-free-mining-button" onClick={handleStartFreeMining} disabled={freeMiningUsedToday} >
            {freeMiningUsedToday ? "Already Claimed Today" : "Start Free Mining"}
          </button>
        </div>

        <div className="ad-mining-panel-card">
          <h3>📺 Ad Mining Session</h3>
          <p>Speed: <strong>0.00000000001 BTC/sec</strong></p>
          <p>Duration: <strong>24 hours</strong></p>
          <p>Ads Watched Today: <strong>{adsWatchedToday}/35</strong></p>
          <button className="start-ad-mining-button" onClick={handleWatchAdForMining} disabled={adsWatchedToday >= 35 || adMiningActive} >
            {adsWatchedToday >= 35 ? "Daily Limit Reached" : `Watch Ad to Start Mining (${adMiningCount} Active)`}
          </button>


          {/* For web application ad integration */}
          <div id="ad-container" style={{ width: '100%', textAlign: 'center' }}>
            <h1>watch complete ad</h1>
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-7231546562185055"
              data-ad-slot="9660106829"
              data-ad-format="auto"
              data-full-width-responsive="true">
            </ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>

          {/* For mobile application ad integration */}
        </div>
      </div>

      <hr className="section-divider" />

      {showSessionsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Active Mining Sessions</h2>
            {activeSessions.length > 0 ? (
              <div className="session-table-container">
                <table className="session-table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Type</th>
                      <th>Started At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((session, index) => (
                      <tr key={session.id}>
                        <td>{index + 1}</td>
                        <td>{session.minerType}</td>
                        <td>{session.startedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No active sessions available.</p>
            )}
            <button onClick={handleCloseSessionsModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MiningPanel;
