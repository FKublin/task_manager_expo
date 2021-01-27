import React from 'react'
import {View, 
        Modal, 
        Text,  
        TouchableHighlight, TouchableOpacity,
        Platform, 
        StyleSheet, FlatList, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';        
import WebModal from 'modal-react-native-web'
import {Icon, Button} from 'react-native-elements';
import config from '../../config.json';

class OptionsModal extends React.Component {

    constructor(props){
        super(props)
    }

    removeUser = async (id) => {
        //const {projectId} = this.id;
        //const {taskId} = this.taskId;
        console.log("User to be removed: " + id)
        var token = await AsyncStorage.getItem('token');
        const url =
          this.props.serverUrl + 'projects/' + this.props.projectId + '/users/' + id;
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
          .then(json => {}).then(this.props.updateData())
          .catch(error => console.error(error));
        await this.props.updateData();
    }

    deleteProject = async() => {
      var token = await AsyncStorage.getItem('token');
        const url =
          this.props.serverUrl + 'projects/' + this.props.projectId;
        //console.log(url);
        fetch(url, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        })
          .then(response => {
            response.json()
            const {navigation} = this.props;
            navigation.navigate('DashboardView');
          })
         
          .catch(error => console.error(error));
        
    
    }

    render(){
        return(
            <View>
                {Platform.OS === 'android' ? 

                <Modal
                animationType='slide'
                transparent={true}
                visible={this.props.isVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                    <TouchableOpacity
                    style={styles.deleteProject}
                    onPress={() => {
                      this.deleteProject();
                    }}>
                    <Text style={styles.deleteText}>Delete this project</Text>
                  </TouchableOpacity>  
                    <FlatList
                            data={this.props.users}
                            
                            keyExtractor={({id}, index) => id}
                            renderItem={({item}) => (
                            <View style={styles.userList}>
                                <Text style={{...styles.modalText}, {padding: 10}}>{item.userName}</Text>
                                {/* <TouchableOpacity
                                style={styles.insideBtn}
                                title="123"
                                onPress={() => {                               
                                    this.removeUser(item.id);
                                }}>
                                <Icon name="delete" color="#ffffff" />
                                </TouchableOpacity> */}
                                <Button icon={
                                  <Icon name='delete' color="#ffffff" />
                                } 
                                onPress={() => {                               
                                  this.removeUser(item.id);
                              }}/>
                            </View>
                            )}
                        />

                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          //this.setModalVisible(!modalVisible);
                          this.setState({taskEndDate: '', pickedUser: '', taskName: ''})
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.modalText}>Cancel</Text>
                      </TouchableHighlight>                    
                    </View>
                  </View>
                </Modal>

                :

                <WebModal
                animationType="slide"
                transparent={true}
                visible={this.props.isVisible}
                hasBackdrop={true}
                backdropColor='black'
                backdropOpacity='0.70'
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                    <TouchableOpacity
                    style={styles.deleteProject}
                    onPress={() => {
                      this.deleteProject();
                    }}>
                    <Text style={styles.deleteText}>Delete this project</Text>
                  </TouchableOpacity>
                    <FlatList
                            data={this.props.users}
                            
                            keyExtractor={({id}, index) => id}
                            renderItem={({item}) => (
                            <View style={styles.userList}>
                                <Text style={{...styles.modalText, marginRight: 20}}>{item.userName}</Text>
                                
                                <Button icon={
                                  <Icon name='delete' color="#ffffff" />
                                } 
                                onPress={() => {                               
                                  this.removeUser(item.id);
                              }}/>
                            </View>
                            )}
                        />



                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                          //this.setModalVisible(!modalVisible);
                          this.setState({taskEndDate: '', pickedUser: '', taskName: ''})
                          this.props.onClose();
                        }}
                      >
                        <Text style={styles.modalText}>Cancel</Text>
                      </TouchableHighlight>

                      
                      
                    </View>
                  </View>
                </WebModal>
            }
                
            </View>
        )
    }

}


export default OptionsModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
      justifyContent: 'center',  
      alignItems: 'center',   
      backgroundColor : "white",   
      height: 300 ,  
      width: '50%',  
      borderRadius:10,  
      borderWidth: 1,  
      borderColor: '#fff',    
      marginTop: 80,  
      marginLeft: 40,  
      //elevation: 5
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
      userList: {
        flex: 1,
        width: '50%',                                
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      modalText: {
        //
        textAlign: "center"
      },
      deleteProject: {
        //width: '85%',
        height: 45,
        borderRadius: 40,
        backgroundColor: '#c92c20',
        justifyContent: 'center',
      },
      deleteText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 22,
      },
})