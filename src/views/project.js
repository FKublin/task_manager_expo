import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Platform, Modal, Picker
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {List, Checkbox, FAB} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import config from '../config.json';
import WebModal from 'modal-react-native-web';
import TaskModal from '../modals/taskModal';



class ProjectView extends React.Component{
    id = {projectId: this.props.route.params.user};
    projectName = {projectName: this.props.route.params.name};
    taskId = '';

  
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          users: [],
          taskName: '',
          pickedUser: '',
          addEmail: '',
          modalVisible: false,
          addUserModalVisible: false,
          serverUrl: '',
          taskEndDate: ''
        };
        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => {
                //this.navigateToProductListSettings();
              }}>
              <Icon name="settings"/>
            </TouchableOpacity>
          ),
        });
      }

      addUser = async() => {
        var token = await AsyncStorage.getItem('token');
      fetch(this.state.serverUrl + 'projects/' + this.id.projectId + '/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          email: this.state.addEmail
        }),
      });

      
      await this.getData();
      }

      submitTask = async (data) => {
      var token = await AsyncStorage.getItem('token');
      fetch(this.state.serverUrl + 'projects/' + this.id.projectId + '/tasks', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          taskName: this.state.taskName
        }),
      }).then(this.getData())
      .catch(error => console.error(error));;

      
      await this.getData();
      }
    
      removeTask = async (id) => {
        const {projectId} = this.id;
        //const {taskId} = this.taskId;
        var token = await AsyncStorage.getItem('token');
        const url =
          this.state.serverUrl + 'projects/' + projectId + '/tasks/' + id;
        console.log(url);
        fetch(url, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        })
          .then(response => response.json())
          .then(json => {}).then(this.getData())
          .catch(error => console.error(error));
        await this.getData();
      }

      setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }

      getData = async () => {
        const {projectId} = this.id;
        var token = await AsyncStorage.getItem('token');
        const url = this.state.serverUrl + 'projects/' + projectId + '/tasks';
        fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        })
          .then(response => response.json())
          .then(json => {
            this.setState({data: json.data});
            this.setState({users: json.users});
            console.log(this.state);
          })
          .catch(error => console.error(error))
      };  

      componentDidMount = async () => {
        if(Platform.OS === 'android')
            this.setState({serverUrl: config.mobileBackendUrl});
          else
            this.setState({serverUrl: config.backendUrl});
        const {navigation} = this.props;
        await navigation.addListener('focus', async () => {
          this.getData();
        })
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
        var expr = new RegExp(/\D\/$/);
        if (expr.test(input)) input = input.substr(0, input.length - 3);
        var values = input.split('/').map(function (v) {
          return v.replace(/\D/g, '');
        });
        if (values[1]) values[1] = this.checkValue(values[1], 31);
        if (values[0]) values[0] = this.checkValue(values[0], 12);
        var output = values.map(function (v, i) {
          return v.length == 2 && i < 2 ? v + '/' : v;
        });
        this.setState({
          taskEndDate: output.join('').substr(0, 14),
        });
      };
      

    render() {
        const {data} = this.state;
        const {projectId} = this.id;
        const {projectName} = this.projectName;
        const {modalVisible} = this.state;

        return (
          <View style={styles.big}>
            <Text style={styles.projectName}>{projectName}</Text>
            

            <FlatList
              data={data}
              keyExtractor={({_id}, index) => _id}
              renderItem={({item}) => (
                <View style={styles.listContainer}>
                  <List.Section style={styles.list}>
                    <List.Accordion
                      title={item.taskName}
                    >
                      <TouchableOpacity
                        style={styles.insideBtn}
                        title="123"
                        onPress={() => {
                          console.log('pressed');
                          //this.taskId = item._id;
                          this.removeTask(item._id);
                        }}>
                        <Icon name="delete" color="#ffffff" />
                      </TouchableOpacity>
                    </List.Accordion>
                  </List.Section>
                </View>
              )}
            />
            <FAB
              style={styles.fab}
              icon="account-plus"
              onPress={() => {
                this.setState({addUserModalVisible: true});
              }}
            />
            <FAB
              style={styles.fab2}
              icon="pen-plus"
              onPress={() => {
                this.setModalVisible(true);
              }}
            />
              {/* {//task modal
              Platform.OS === 'android' ? 
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add a new task</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="Task name"
                        value={this.state.taskName}
                        onChangeText={(taskName) => this.setState({taskName})}/>
                        
                      </View>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.submitTask({taskName: this.state.taskName});
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Create</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>  : 

                <WebModal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
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
                        placeholder="MM/DD/YYYY"
                        onChangeText={(e) => this.dateTimeInputChangeHandler(e)}
                        value={this.state.taskEndDate}
                      />
                      <Picker selectedValue={this.state.pickedUser} onValueChange={(itemValue, itemIndex) => {
                        this.setState({pickedUser: itemValue})
                      }}>
                        {this.state.users.forEach((user) => {
                          <Picker.Item label={user.userName} value={user.userName} key={user.id} />
                        })}
                      </Picker>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.submitTask({taskName: this.state.taskName, taskHolder: this.state.pickedUser});
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Create</Text>
                      </TouchableHighlight>
                      
                      </View>
                    </View>
                  </View>
                </WebModal>  
          
    } */}

    <TaskModal 
      users={this.state.users} 
      isVisible={this.state.modalVisible} 
      onClose={()=> {this.setState({modalVisible: false})}} 
      updateData={() => {this.getData()}}
      projectId={this.id.projectId}
      serverUrl={this.state.serverUrl}
      />

    
    {//user modal
    Platform.OS === 'web' ?
              <WebModal
                animationType="slide"
                transparent={true}
                visible={this.state.addUserModalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Add a new user</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="User's email"
                        value={this.state.use}
                        onChangeText={(email) => this.setState({addEmail: email})}/>
                      </View>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.setState({addUserModalVisible: false});
                        }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          this.addUser({email: this.state.addEmail});
                          this.setState({addUserModalVisible: false});
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
              visible={this.state.addUserModalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Add a new user</Text>
                    <View style={styles.inputContainer}>
                      <TextInput style={styles.inputs}
                      keyboardType="default"
                      placeholder="User's email"
                      value={this.state.use}
                      onChangeText={(email) => this.setState({addEmail: email})}/>
                    </View>
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                      onPress={() => {
                        this.setState({addUserModalVisible: false});
                      }}
                    >
                      <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                      onPress={() => {
                        this.addUser({email: this.state.addEmail});
                        this.setState({addUserModalVisible: false});
                      }}
                    >
                      <Text style={styles.textStyle}>Add</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>                
    }
          </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      width: '90%',
      borderRadius: 30,
      marginBottom: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    list: {
      width: '87%',
    },
    checkbox: {
      height: 120,
    },
    projectName: {
      textAlign: 'center',
      paddingTop: 30,
      fontSize: 25,
      paddingBottom: 20,
    },
    big: {
      textAlign: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 10,
      bottom: 10,
    },
    fab2: {
      position: 'absolute',
      margin: 16,
      right: 10,
      bottom: 90,
    },
    touchable: {
      width: 50,
      height: 50,
      paddingTop: 12,
    },
    insideBtn: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: '#c91414',
      right: -35,
      bottom: 10,
      justifyContent: 'center',
    },
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
  });

export default ProjectView;