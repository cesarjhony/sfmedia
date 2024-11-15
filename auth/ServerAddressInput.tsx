import React, { useState } from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native';
import NextcloudLogin from './NextcloudLogin';

const ServerAddressInput = () => {
  const [serverAddress, setServerAddress] = useState('');

  const handleLogin = () => {
    // Pass the server address to the NextcloudLogin component
    // This can be done by setting a state or using a context
    setServerAddress(serverAddress);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter server address"
        value={serverAddress}
        onChangeText={setServerAddress}
      />
      <Button title="Start Login Flow" onPress={handleLogin} />
      <NextcloudLogin serverAddress={serverAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ServerAddressInput;
