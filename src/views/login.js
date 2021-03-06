import React from 'react';
import { StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert, Platform } from 'react-native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config.json';

class LoginView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            serverUrl: ''
        }
    }

    navigateToPage = (page) => {
        this.props.navigation.navigate(page);
    }

    componentDidMount = async () => {
      var token = await AsyncStorage.getItem('token');
      if(token != null)
        this.navigateToPage('DashboardView');

      if(Platform.OS === 'android')
        this.setState({serverUrl: config.mobileBackendUrl});
      else
        this.setState({serverUrl: config.backendUrl});  
    }

    onLogin = (data) => {
        fetch(this.state.serverUrl + 'users/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          })
            .then(response => response.json())
            .then(res => {
              if (res.token == null) {
                Alert.alert(res.message);
              } else {
                console.log(res.token);
                AsyncStorage.setItem('token', res.token);
                this.setState({email: '', password: ''});
                //setUserToken(res.token);
                this.navigateToPage('DashboardView')
              }
            });
    }

    render() {
        return(
        <View style={styles.container}>
            <Text style={styles.titlePage}>Log In</Text>
            <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                keyboardType="email-address"
                placeholder="Email"
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}/>
            </View>
            <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                value={this.state.password}
                onChangeText={(password) => this.setState({password})}/>
            </View>
            {!!this.state.nameError && (
            <View styles={styles.divError}>
                <Text style={styles.divErrorFont}>{this.state.nameError}</Text>
            </View>
            )}
            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onLogin({
                email: this.state.email,
                password: this.state.password
            })}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableHighlight>
            {/* <Button style={styles.loginBtn} mode="contained" onPress={() => this.onLogin({
                    email: this.state.email, 
                    password: this.state.password
                })} title="Login" >Login</Button> */}
            <View style={styles.containerLinksRow}>
            

            <TouchableHighlight style={styles.txtLink} onPress={() => this.navigateToPage('SignUpView')}>
                <Text style={{fontWeight:'bold'}}>Register</Text>
            </TouchableHighlight>
            </View>            
        </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#007eec",
      padding: 30
    },
    row: {
      flexDirection: "row"
    },
    titlePage:{
      marginBottom: 30,
      fontSize: 25,
      fontWeight: 'bold'
    },
    loginBtn: {
        width: '85%',
        height: 60,
        justifyContent: 'center',
        borderRadius: 40,
      },
    inputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      height: 50,
      marginBottom: 15,
      flexDirection: 'row'
    },
    divErrorFont:{
      textAlign: 'center',
      color: '#721c24',
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      padding: 20,
      marginTop: 10,
      marginBottom: 10,
      borderWidth: 2,
    },
    inputs:{
      height: 50,
      marginLeft:16,
      flex:1,
    },
    fontAwesomeIcon:{
      width:30,
      height:30,
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
      flexDirection: 'row',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width: 250,
      borderRadius: 5,
    },
    loginButton: {
      backgroundColor: '#04dbc3',
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerLinksRow:{
      marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    txtLink:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
        padding: 15
    },  
    loginText: {
      color: 'black',
      fontWeight: 'bold'
    }
  });
export default LoginView