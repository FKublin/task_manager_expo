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
import {List, FAB} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import config from '../config.json';
import WebModal from 'modal-react-native-web';
import TaskModal from '../modals/taskModal';
import OptionsModal from '../modals/optionsModal'
import UserModal from '../modals/userModal';
import CommentsSection from '../components/comment'



class ProjectView extends React.Component{
    id = {projectId: this.props.route.params.user};
    projectName = {projectName: this.props.route.params.name};
    taskId = '';

  
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          users: [],
          taskModalVisible: false,
          addUserModalVisible: false,
          optionsModalVisible: false,
          serverUrl: '',
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

      checkTask = async (id) => {
        const {projectId} = this.id;
        var token = await AsyncStorage.getItem('token');
        var token = await AsyncStorage.getItem('token');
        const url =
          this.state.serverUrl + 'projects/' + projectId + '/tasks/' + id;
        //console.log(url);
        fetch(url, {
          method: 'POST',
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
          <View style={styles.big }>
            <Text style={styles.projectName}>{projectName}</Text>
            <Text style={styles.textHeader}>My tasks:</Text>

            <FlatList
              data={data}
              keyExtractor={({_id}, index) => _id}
              renderItem={({item}) => (
                
                <View style={[styles.listContainer, item.isCompleted ? styles.isCompleted : 
                new Date(item.endDate) < Date.now() ? styles.isPastDate : null]}>
                  <List.Section style={styles.list}>
                    <List.Accordion
                      title={item.taskName}
                    >
                      <List.Item title={this.state.users== null ? 'Checking...' : 'Assigned user: ' + 
                      this.mapUser(item.taskHolder)}/>
                      <List.Item title={'End date: ' + new Date(item.endDate).toString()} />

                      <List.Item title='Comments: ' />

                      <CommentsSection serverUrl={this.state.serverUrl} projectId={this.id.projectId} 
                      taskId={item._id} updateData={()=>{this.getData()}} data={item.comments} mapUser={(id) => this.mapUser(id)}/>


                       {this.state.isAdmin && <TouchableOpacity
                        style={styles.insideButton}
                        title="123"
                        onPress={() => {
                          this.removeTask(item._id);
                        }}>
                        <Icon name="delete" color="#ffffff" />
                      </TouchableOpacity> }

                      {item.isCompleted==false && <TouchableOpacity
                        style={styles.insideButton2}
                        title="123"
                        onPress={() => {
                          this.checkTask(item._id);
                        }}>
                        <Icon name="check" color="#ffffff" />
                      </TouchableOpacity>}

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

      <UserModal
      isVisible={this.state.addUserModalVisible}
      onClose={()=> {this.setState({addUserModalVisible: false})}}
      updateData={()=> {this.getData()}}
      projectId={this.id.projectId}
      serverUrl={this.state.serverUrl} />

  
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
      width: '80%',
      borderRadius: 30,
      marginBottom: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    isCompleted: {
      backgroundColor: '#73E68A'
    },
    isPastDate: {
      backgroundColor: '#ff4d4d'
    },
    list: {
      width: '80%',
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
    insideButton: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: '#c91414',
      right: -35,
      bottom: 10,
      justifyContent: 'center',
    },
    insideButton2: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: '#73E68A',
      right: -35,
      bottom: 65,
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