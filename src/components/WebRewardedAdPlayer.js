import { useEffect } from 'react';

const WebRewardedAdPlayer = ({ onReward }) => {
  useEffect(() => {
    const adContainer = document.getElementById('ad-container');

    const adDisplayContainer = new window.google.ima.AdDisplayContainer(adContainer);
    const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
      window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (adsManagerLoadedEvent) => {
        const adsManager = adsManagerLoadedEvent.getAdsManager();
        adsManager.addEventListener(window.google.ima.AdEvent.Type.COMPLETE, () => {
          onReward(); // Grant reward (start mining)
        });
        adsManager.init(640, 360, window.google.ima.ViewMode.NORMAL);
        adsManager.start();
      }
    );

    const adsRequest = new window.google.ima.AdsRequest();
    adsRequest.adTagUrl = 'YOUR_AD_TAG_URL'; // from Google Ad Manager
    adsLoader.requestAds(adsRequest);
  }, []);

  return <div id="ad-container" style={{ width: 640, height: 360 }} />;
};
