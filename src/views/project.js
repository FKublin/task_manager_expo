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
import OptionsModal from '../modals/optionsModal'



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
          taskModalVisible: false,
          addUserModalVisible: false,
          optionsModalVisible: false,
          serverUrl: '',
          taskEndDate: '',
          isAdmin: false
        };

        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => {
                console.log(this.state.users)
                this.setState({optionsModalVisible: true})
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
    
      mapUser(id) {
        const foundUser = this.state.users.find(user => user.id === id)
        if(foundUser)
          return foundUser.userName
        else
          return 'no user found'
      }


      removeTask = async (id) => {
        const {projectId} = this.id;
        //const {taskId} = this.taskId;
        var token = await AsyncStorage.getItem('token');
        const url =
          this.state.serverUrl + 'projects/' + projectId + '/tasks/' + id;
        //console.log(url);
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
        this.setState({ taskModalVisible: visible });
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
            console.log(json);
            this.setState({data: json.data});
            this.setState({users: json.users});
            this.setState({isAdmin: json.isAdmin})
            //console.log(this.state);
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
        await this.getData();
      }
      
      
    render() {
        const {data} = this.state;
        const {projectId} = this.id;
        const {projectName} = this.projectName;
        //const {modalVisible} = this.state;

        return (
          <View style={styles.big}>
            <Text style={styles.projectName}>{projectName}</Text>
            <Text style={styles.textHeader}>Tasks:</Text>

            <FlatList
              data={data}
              keyExtractor={({_id}, index) => _id}
              renderItem={({item}) => (
                
                <View style={styles.listContainer}>
                  <List.Section style={styles.list}>
                    <List.Accordion
                      title={item.taskName}
                    >
                      <List.Item title={this.state.users== null ? 'Checking...' : 'Assigned user: ' + 
                      this.mapUser(item.taskHolder)}/>
                      <List.Item title={'End date: ' + new Date(item.endDate).getMonth() + '/' 
                      + new Date(item.endDate).getDate() + '/' 
                      + new Date(item.endDate).getFullYear()} />
                      
                       {this.state.isAdmin && <TouchableOpacity
                        style={styles.insideBtn}
                        title="123"
                        onPress={() => {
                          //console.log('pressed');
                          //this.taskId = item._id;
                          this.removeTask(item._id);
                        }}>
                        <Icon name="delete" color="#ffffff" />
                      </TouchableOpacity> }
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


      <TaskModal 
      users={this.state.users} 
      isVisible={this.state.taskModalVisible} 
      onClose={()=> {this.setState({taskModalVisible: false})}} 
      updateData={() => {this.getData()}}
      projectId={this.id.projectId}
      serverUrl={this.state.serverUrl}
      />

      <OptionsModal
      users={this.state.users}
      isVisible={this.state.optionsModalVisible}
      onClose={()=> {this.setState({optionsModalVisible: false})}}
      updateData={() => {this.getData()}}
      projectId={this.id.projectId}
      serverUrl={this.state.serverUrl} />

    
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
    textHeader: {
      textAlign: 'left',
      fontWeight: 'bold',
      paddingTop: 30,
      paddingLeft: 10,
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