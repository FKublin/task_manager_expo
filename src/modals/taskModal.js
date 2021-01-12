import React from 'react'
import {View, 
        Modal,
        Text, 
        TextInput, 
        TouchableHighlight, 
        Platform, 
        StyleSheet, Picker} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';        
import WebModal from 'modal-react-native-web'
import {Picker as MobilePicker} from '@react-native-picker/picker'
//import Modal from 'react-native-modal';
import config from '../config.json';

class TaskModal extends React.Component {


    constructor(props){
        super(props)
        this.state = {
            taskName: '',
            pickedUser: '',
            taskEndDate: ''
        }
    }

    

    submitTask = async (data) => {
        var token = await AsyncStorage.getItem('token');
        fetch(this.props.serverUrl + 'projects/' + this.props.projectId + '/tasks', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            taskName: data.taskName,
            endDate: data.endDate,
            taskHolder: data.taskHolder
          }),
        }).then(this.props.updateData())
        .catch(error => console.error(error));;
  
        
        await this.props.updateData();
        }

        checkValue(str, max) {
            if (str.charAt(0) !== '0' || str == '00') {
              var num = parseInt(str);
              if (isNaN(num) || num <= 0 || num > max) num = 1;
              str =
                num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
                  ? '0' + num
                  : num.toString();
            }
            return str;
          }

          
    
          dateTimeInputChangeHandler = (e) => {
            this.type = 'text';
            var input = e;
            var expr = new RegExp(/\D\-$/);
            if (expr.test(input)) input = input.substr(0, input.length - 3);
            var values = input.split('-').map(function (v) {
              return v.replace(/\D/g, '');
            });
            if (values[1]) values[1] = this.checkValue(values[1], 12);
            if (values[0]) values[0] = this.checkValue(values[0], 31);
            var output = values.map(function (v, i) {
              return v.length == 2 && i < 2 ? v + '-' : v;
            });
            this.setState({
              taskEndDate: output.join('').substr(0, 14),
            });
          };

    render() {
        return(
            <View>
            {//task modal
                Platform.OS === 'web' ? 

                <WebModal
                animationType="slide"
                transparent={true}
                visible={this.props.isVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add a new task</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        style={{
                          textAlign: 'center',
                          width: 300,
                          backgroundColor: 'white',
                          padding: 10,
                          marginBottom: 30,
                          borderWidth: 1,
                          borderColor: 'black',
                          paddingHorizontal: 30,
                        }}
                        placeholder="Task name"
                        value={this.state.taskName}
                        onChangeText={(taskName) => this.setState({taskName})}/>
                        <TextInput
                        keyboardType="number-pad"
                        style={{
                          textAlign: 'center',
                          width: 300,
                          backgroundColor: 'white',
                          padding: 10,
                          marginBottom: 30,
                          borderWidth: 1,
                          borderColor: 'black',
                          paddingHorizontal: 30,
                        }}
                        maxLength={10}
                        placeholder="DD-MM-YYYY"
                        onChangeText={(e) => this.dateTimeInputChangeHandler(e)}
                        value={this.state.taskEndDate}
                      />
                      <Picker selectedValue={this.state.pickedUser} onValueChange={(itemValue, itemIndex) => {
                        this.setState({pickedUser: itemValue})
                      }}>
                        {
                          this.props.users.map((user) => {
                            //console.log('userName: '+ user.userName);
                            return <Picker.Item label={user.userName} value={user.id} key={user.id}/>
                          })
                        }
                      </Picker>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          //this.setModalVisible(!modalVisible);
                          this.setState({taskEndDate: '', pickedUser: '', taskName: ''})
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.submitTask({taskName: this.state.taskName, endDate: this.state.taskEndDate, taskHolder: this.state.pickedUser});
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.textStyle}>Create</Text>
                      </TouchableHighlight>
                      
                      </View>
                    </View>
                  </View>
                </WebModal> 
                :
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.props.isVisible}
                >
                  <View style={styles.centeredView}>
                     <View style={styles.modalView}> 
                      <Text style={styles.modalText}>Add a new task</Text>
                      <View style={styles.inputContainer}>

                      <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="Task name"
                        value={this.state.addEmail}
                        onChangeText={(taskNameText) => this.setState({taskName: taskNameText})}/>
                      <TextInput style={styles.inputs}
                        keyboardType="number-pad"
                        maxLength={10}
                        placeholder="DD-MM-YYYY"
                        value={this.state.taskEndDate}
                        onChangeText={(e) => this.dateTimeInputChangeHandler(e)}/>
                      <MobilePicker selectedValue={this.state.pickedUser} onValueChange={(itemValue, itemIndex) => {
                        this.setState({pickedUser: itemValue})
                      }}>
                        {
                          this.props.users.map((user) => {
                            //console.log('userName: '+ user.userName);
                            return <MobilePicker.Item label={user.userName} value={user.id} key={user.id}/>
                          })
                        }
                      </MobilePicker>

                        <View style={{flexDirection:'row'}}>
                          <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                              //this.setModalVisible(!modalVisible);
                              this.setState({taskEndDate: '', pickedUser: '', taskName: ''})
                              this.props.onClose();
                            }}
                            >
                            <Text style={styles.textStyle}>Cancel</Text>
                          </TouchableHighlight>

                          <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                              this.submitTask({taskName: this.state.taskName, endDate: this.state.taskEndDate, taskHolder: this.state.pickedUser});
                              this.props.onClose();
                            }}
                            >
                            <Text style={styles.textStyle}>Create</Text>
                          </TouchableHighlight>
                        </View>
                      </View>                     
                    </View> 
                  </View>
                </Modal> 

                
            }
            </View>
        )
    }


}

export default TaskModal;

const styles = StyleSheet.create({
    centeredView: {
        //flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        flexDirection: 'column'
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        height: 300,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'column'
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      inputs:{
        height: 50,
        width:150,
        
        marginLeft: 16,
        borderWidth: 1,
        //flex:1,
      },
      inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        height: 50,
        marginBottom: 15,
        flexDirection: 'column'
      },
})