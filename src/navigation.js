import React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import SignUpView from './views/signup';
import LoginView from './views/login';
import DashboardView from './views/dashboard';
import ProjectView from './views/project';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';


const Stack = createStackNavigator()
//const navigation = useNavigation();
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
                options={({navigation}) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                          {...props}
                          onPress={() => {
                            AsyncStorage.removeItem('token');
                            //this.props.navigation.navigate("LoginView")
                            navigation.dispatch(StackActions.popToTop());
  
                          }}
                        />
                      ),
                })}
                
            />
            <Stack.Screen
                name="ProjectView"
                component={ProjectView}
            />

        </Stack.Navigator>
  
    );
}
};
  