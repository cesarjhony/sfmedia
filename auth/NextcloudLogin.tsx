import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
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
      setPollUrl(response.data.poll.endpoint);
      setPollToken(response.data.poll.token);
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
        const response = await axios.post(pollUrl, {
          token: pollToken
        });
        if (response.status === 200) {
          console.log('login REALIZADO')
          setAccessToken(response.data.token);
          await SecureStore.setItemAsync('nextcloudAccessToken', response.data.token);
          await SecureStore.setItemAsync('nextcloudLoginName', response.data.loginName);
          await SecureStore.setItemAsync('nextcloudAppPassword', response.data.appPassword);
        }
      } catch (error) {
        if(error.response.status===404)
          console.log('faça login')
        else
          console.error('Error polling server:', error);
      }
    };

    const checkStoredCredentials = async () => {
      const storedAppPassword = await SecureStore.getItemAsync('nextcloudAppPassword');
      if (storedAppPassword) {
        return;
      }

      if (pollUrl && pollToken) {
        const interval = setInterval(pollServer, 5000);
        return () => clearInterval(interval);
      }
    };

    checkStoredCredentials();
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
