import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          drawerLabel: 'Explore',
        }}
      />
    </Drawer>
  );
}
