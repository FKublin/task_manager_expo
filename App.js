import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {Icon, Button} from 'react-native-elements';
import AppNavigator from './src/navigation';

export default class App extends React.Component {
  
  render() {  
    return (
        
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
    
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
