import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestRenderer from 'react-test-renderer';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import NextcloudLogin from '../NextcloudLogin';
import ServerAddressInput from '../ServerAddressInput';

import { act } from 'react-dom/test-utils';

jest.mock('axios');
jest.mock('expo-web-browser');

describe('NextcloudLogin', () => {
  it('initializes the login flow', async () => {
    const mockResponse = { data: { login: 'loginUrl', poll: 'pollUrl' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    let getByText = {};
    act(async () => {
      const { getByText2 } = await TestRenderer.create(<NextcloudLogin serverAddress="https://example.com" />);
      getByText = getByText2;
    });
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('https://example.com/index.php/login/flow'));
    await waitFor(() => expect(getByText('Login with Nextcloud')).toBeTruthy());
  }); 

  it('opens the login URL', async () => {
    const mockResponse = { data: { login: 'loginUrl', poll: 'pollUrl' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    let getByText = {};
    act(() => {
      const { getByText2 } = TestRenderer.create(<NextcloudLogin serverAddress="https://example.com" />);
      getByText = getByText2;
    });
    fireEvent.press(getByText('Login with Nextcloud'));
    await waitFor(() => expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('loginUrl'));
  });

  it('polls the server', async () => {
    const mockResponse = { data: { login: 'loginUrl', poll: 'pollUrl' } };
    axios.post.mockResolvedValueOnce(mockResponse);
    axios.get.mockResolvedValueOnce({ status: 200, data: { token: 'accessToken' } });

    let getByText = {};
    act(() => {
      const { getByText2 } = TestRenderer.create(<NextcloudLogin serverAddress="https://example.com" />);
      getByText = getByText2;
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('pollUrl'));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  it('stores the access token', async () => {
    const mockResponse = { data: { login: 'loginUrl', poll: 'pollUrl' } };
    axios.post.mockResolvedValueOnce(mockResponse);
    axios.get.mockResolvedValueOnce({ status: 200, data: { token: 'accessToken' } });

    let getByText = {};
    act(() => {
      const { getByText2 } = TestRenderer.create(<NextcloudLogin serverAddress="https://example.com" />);
      getByText = getByText2;
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('pollUrl'));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    // Add your secure storage mock and test here
  });
});

describe('ServerAddressInput', () => {
  it('handles user input for the server address', () => {
    let getByPlaceholderText = {};
    act(() => {
      const { getByPlaceholderText2 } = TestRenderer.create(<ServerAddressInput />);
      getByPlaceholderText = getByPlaceholderText2;
    });
    const input = getByPlaceholderText('Enter server address');
    fireEvent.changeText(input, 'https://example.com');
    expect(input.props.value).toBe('https://example.com');
  });

  it('passes the server address to NextcloudLogin', () => {
    let getByPlaceholderText = {};
    let getByText = {};
    act(() => {
      const { getByPlaceholderText2, getByText2 } = TestRenderer.create(<ServerAddressInput />);
      getByPlaceholderText = getByPlaceholderText2;
      getByText = getByText2;
    });
    const input = getByPlaceholderText('Enter server address');
    fireEvent.changeText(input, 'https://example.com');
    fireEvent.press(getByText('Start Login Flow'));
    // Add your assertion to check if the server address is passed to NextcloudLogin
  });
});
