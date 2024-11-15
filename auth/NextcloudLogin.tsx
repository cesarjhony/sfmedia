import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { View, Button } from 'react-native';

const NextcloudLogin = ({ serverAddress }) => {
  const [loginUrl, setLoginUrl] = useState('');
  const [pollUrl, setPollUrl] = useState('');
  const [pollToken, setPollToken] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const initializeLoginFlow = async () => {
    try {
      const response = await axios.post(`${serverAddress}/index.php/login/v2`); 
      console.log(response.data);
      setLoginUrl(response.data.login);
      console.log('vai 1');
      setPollUrl(response.data.poll.endpoint);
      console.log('vai 2');
      setPollToken(response.data.poll.token);
      console.log('vai 3');
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
        const response = await axios.post(pollUrl, `token=${pollToken}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        if (response.status === 200) {
          console.log(`login realizado token=${response.data.token}`);
          setAccessToken(response.data.token);
        }
      } catch (error) {
        if (error.response.status === 404) {
          console.log('Error 404: faça login');
          console.log(`token=${pollToken}`);

        }else
        console.error('Error polling server:', error);
      }
    };

    if (pollUrl && pollToken) {
      const interval = setInterval(pollServer, 5000);
      return () => clearInterval(interval);
    }
  }, [pollUrl, pollToken]);

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
