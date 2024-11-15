import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

const NextcloudLogin = () => {
  const [loginUrl, setLoginUrl] = useState('');
  const [pollUrl, setPollUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const initializeLoginFlow = async () => {
      try {
        const response = await axios.post('<server>/index.php/login/flow');
        console.log(response.data);
        setLoginUrl(response.data.login);
        setPollUrl(response.data.poll);
      } catch (error) {
        console.error('Error initializing login flow:', error);
      }
    };

    initializeLoginFlow();
  }, []);

  const openLoginUrl = async () => {
    try {
      await WebBrowser.openBrowserAsync(loginUrl);
    } catch (error) {
      console.error('Error opening login URL:', error);
    }
  };

  useEffect(() => {
    const pollServer = async () => {
      try {
        const response = await axios.get(pollUrl);
        if (response.status === 200) {
          setAccessToken(response.data.token);
        }
      } catch (error) {
        console.error('Error polling server:', error);
      }
    };

    if (pollUrl) {
      const interval = setInterval(pollServer, 5000);
      return () => clearInterval(interval);
    }
  }, [pollUrl]);

  useEffect(() => {
    if (accessToken) {
      // Save the access token securely for future API requests
      // For example, using SecureStore from expo-secure-store
      // SecureStore.setItemAsync('nextcloudAccessToken', accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <button onClick={openLoginUrl}>Login with Nextcloud</button>
    </div>
  );
};

export default NextcloudLogin;