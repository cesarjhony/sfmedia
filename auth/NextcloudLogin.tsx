import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { View, Button } from 'react-native';

const NextcloudLogin = ({ serverAddress }) => {
  const [loginUrl, setLoginUrl] = useState('');
  const [pollUrl, setPollUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const initializeLoginFlow = async () => {
    try {
      const response = await axios.post(`${serverAddress}/index.php/login/v2`); 
      console.log(response.data);
      //setLoginUrl(response.data.login); //este nao eh o problema
      console.log('vai 1');
      setPollUrl(response.data.poll);
      console.log('vai 2');
    } catch (error) {
      console.error('Error initializing login flow:', error);
    }
  };

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
    <View>
      <Button onPress={initializeLoginFlow} title="Initialize Login Flow" />
      <Button onPress={openLoginUrl} title="Login with Nextcloud" />
    </View>
  );
};

export default NextcloudLogin;
