import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpView from './views/signup';
import LoginView from './views/login';
import DashboardView from './views/dashboard';
import ProjectView from './views/project';

const Stack = createStackNavigator()

export default class AppNavigator extends React.Component{
    
render(){
    return (
        <Stack.Navigator initialRouteName="LoginView">
            <Stack.Screen
                name="SignUpView"
                component={SignUpView}
            />
            <Stack.Screen
                name="LoginView"
                component={LoginView}
            />
            <Stack.Screen
                name="DashboardView"
                component={DashboardView}
                options={{
                    headerShown: false
                  }}  
            />
            <Stack.Screen
                name="ProjectView"
                component={ProjectView}
            />

        </Stack.Navigator>
  
    );
}
};
  