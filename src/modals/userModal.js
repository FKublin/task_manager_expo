import React from 'react'
import {View, 
        Modal, 
        Text,  
        TouchableHighlight, TextInput,
        Platform, 
        StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';        
import WebModal from 'modal-react-native-web'
import {CheckBox} from 'react-native-elements';
import config from '../config.json';

class UserModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            addEmail: '',
            addAsAdmin: false
        }
    }

    addUser = async() => {
        var token = await AsyncStorage.getItem('token');
      fetch(this.props.serverUrl + 'projects/' + this.props.projectId + '/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          email: this.state.addEmail,
          addAsAdmin: this.state.addAsAdmin
        }),
      });

      await this.props.updateData();
      }

    render(){
        return(
            <View>

            {Platform.OS === 'web' ?
              <WebModal
                animationType="slide"
                transparent={true}
                visible={this.props.isVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add a new user</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="User's email"
                        value={this.state.addEmail}
                        onChangeText={(email) => this.setState({addEmail: email})}/>
                        <CheckBox title="Add as an admin?" checked={this.state.addAsAdmin} onPress={()=>{this.setState({addAsAdmin: !this.state.addAsAdmin})}} />
                      </View>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.addUser({email: this.state.addEmail});
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Add</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </WebModal>  : 
              <Modal
              animationType="slide"
              transparent={true}
              visible={this.props.isVisible}
              >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add a new user</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="User's email"
                        value={this.state.addEmail}
                        onChangeText={(email) => this.setState({addEmail: email})}/>
                        <CheckBox title="Add as an admin?" checked={this.state.addAsAdmin} onPress={()=>{this.setState({addAsAdmin: !this.state.addAsAdmin})}} />
                      </View>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.addUser({email: this.state.addEmail});
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Add</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
              </Modal>                
    }
            </View>
        )
    }

}

export default UserModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      inputs:{
        height: 50,
        marginLeft:16,
        flex:1,
      },
      inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        height: 50,
        marginBottom: 15,
        flexDirection: 'column'
      },
})