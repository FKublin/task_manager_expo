import React from 'react'
import {View, 
        Modal, 
        Text,  
        TouchableHighlight, TouchableOpacity,
        Platform, 
        StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';        
import WebModal from 'modal-react-native-web'
import {Icon} from 'react-native-elements';
import config from '../config.json';

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

    render(){
        return(
            <View>
                {Platform.OS === 'android' ? 

                <Modal
                animationType='slide'
                transparent={true}
                isVisible={this.props.isVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <FlatList
                            data={this.props.users}
                            
                            keyExtractor={({_id}, index) => _id}
                            renderItem={({item}) => (
                            <View style={{
                                paddingVertical: 15,
                                paddingHorizontal: 10,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Text style={styles.textStyle}>{item.displayName}</Text>
                                <Icon name="delete" color="#ffffff" onPress={() => {this.removeUser(item._id)}}/>

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
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableHighlight>
                        </View>
                        </View> 
                   

                </Modal>

                :

                // <WebModal
                // animationType='slide'
                // transparent={true}
                // isVisible={this.props.isVisible}>
                //     <View style={styles.centeredView}>
                //         <View style={styles.modalView}>
                //         <FlatList
                //             data={this.props.users}
                            
                //             keyExtractor={({id}, index) => id}
                //             renderItem={({item}) => (
                //             <View style={{
                //                 paddingVertical: 15,
                //                 paddingHorizontal: 10,
                //                 flexDirection: "row",
                //                 justifyContent: "space-between",
                //                 alignItems: "center"
                //             }}>
                //                 <Text style={styles.textStyle}>{item.displayName}</Text>
                //                 <TouchableOpacity
                //                 style={styles.insideBtn}
                //                 title="123"
                //                 onPress={() => {                               
                //                     this.removeUser(item.id);
                //                 }}>
                //                 <Icon name="delete" color="#ffffff" />
                //                 </TouchableOpacity>
                //             </View>
                //             )}
                //         />

                //             <TouchableHighlight
                //             style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                //             onPress={() => {
                //             //this.setModalVisible(!modalVisible);
                //             this.setState({taskEndDate: '', pickedUser: '', taskName: ''})
                //             this.props.onClose();
                //             }}
                //         >
                //             <Text style={styles.textStyle}>Cancel</Text>
                //         </TouchableHighlight>
                //         </View>
                //         </View> 
                   

                // </WebModal>

                <WebModal
                animationType="slide"
                transparent={true}
                visible={this.props.isVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      
                    <FlatList
                            data={this.props.users}
                            
                            keyExtractor={({id}, index) => id}
                            renderItem={({item}) => (
                            <View style={{
                                paddingVertical: 20,
                                paddingHorizontal: 50,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Text style={styles.textStyle}>{item.userName}</Text>
                                <TouchableOpacity
                                style={styles.insideBtn}
                                title="123"
                                onPress={() => {                               
                                    this.removeUser(item.id);
                                }}>
                                <Icon name="delete" color="#ffffff" />
                                </TouchableOpacity>
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
                        <Text style={styles.textStyle}>Cancel</Text>
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
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 50,
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
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
})