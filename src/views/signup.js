import React from 'react';
import { StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert } from 'react-native';
import config from '../config.json';


class SignUpView extends React.Component {

static navigationOptions = {
    header: null,
};

constructor(props){
  super(props);
  this.state = {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
      }
  }

submitAndClear = () => {
    this.setState({
      username: '',
      password: '',
      nameError: null
    })
  }

  navigateToPage = (page) => {
    this.props.navigation.navigate(page);
  }

  alertAnError = (title,message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => {this.navigateToPage('LoginScreen')}},
      ]
    )
  }

  onSignUp = (data) => {
    fetch(config.backendUrl + 'users/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        displayName: data.displayName,
        password: data.password,
      }),
    }).then(Alert.alert('Registered succesfully, now you can logged in!'));
    this.navigateToPage('LoginView');
    //setUserToken(null);
  } 



render(){
    return (
        <View style={styles.container}>
        <Text style={styles.titlePage}>Sign Up</Text>

        <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
            keyboardType="default"
            placeholder="Display name"
            value={this.state.displayName}
            onChangeText={(displayName) => this.setState({displayName})}/>
        </View>

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
            value={this.state.password}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}/>
        </View>

        <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
            placeholder="Confirm password"
            value={this.state.confirmPassword}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>
        </View>

        {!!this.state.nameError && (
            <View styles={styles.divError}>
            <Text style={styles.divErrorFont}>{this.state.nameError}</Text>
            </View>
        )}

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onSignUp({
          email: this.state.email, 
          displayName: this.state.displayName,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        })}>
            <Text style={styles.loginText}>Sign Up</Text>
        </TouchableHighlight>

        <View style={styles.containerLinksRow}>
            <TouchableHighlight style={styles.txtLink} onPress={this.onSignUp}>
            <Text style={{fontWeight:'bold'}}>Already have an account?  
                <Text style={{color: 'blue', paddingLeft: 5}}
                onPress={() => this.props.navigation.navigate('LoginView')}>
                    Log In now
                </Text>
            </Text>
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

  export default SignUpView;