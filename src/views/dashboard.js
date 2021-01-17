import React from 'react';
import { StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    Alert,
    FlatList,
    Platform, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import WebModal from 'modal-react-native-web';
import config from '../config.json';


    
class DashboardView extends React.Component{

    static navigationOptions = {
        title: 'Dashboard',
        header: null,

    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            projectName: '',
            modalVisible: false,
            serverUrl: '',
      
        }
    }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }

    submitProject = async (data) => {
      var token = await AsyncStorage.getItem('token');
      fetch(this.state.serverUrl + 'projects', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          projectName: data.projectName
        }),
      }).then(Alert.alert('Project submitted! Now you can access it from the dashboard'));
      
      await this.getData();
    } 

    handleNavigate = (user, name) => {
      const {navigation} = this.props;
      navigation.navigate('ProjectView', {user, name});
    };

    getData = async () => {
      var token = await AsyncStorage.getItem('token');
      console.log('Token: ' + token);
      fetch(this.state.serverUrl + 'projects', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      })
        .then(response => response.json())
        .then(json => {
          this.setState({data: json.projects});
        })
        .catch(error => console.error(error))
    }
  
    componentDidMount = async () => {
        const {navigation} = this.props;
        await navigation.addListener('focus', async () => {
          

          if(Platform.OS === 'android')
            this.setState({serverUrl: config.mobileBackendUrl});
          else
            this.setState({serverUrl: config.backendUrl});

          console.log(this.state.serverUrl);

          this.getData();
        });
        var index = 1;
        var items = [];
        this.state.data.forEach((item) => {
          items.push({id: index, name: item.projectName})
        })
    }

    render() {
      const { modalVisible } = this.state;

        return(
            <View style={styles.container}>
              
                
                {this.state.data.length == 0 ? 
                    <Text>You do not belong to any projects at the moment. Creat one with the button below or ask for an invitation</Text>
                 : 
                    
                    <FlatList
                    data={this.state.data}
                    
                    keyExtractor={({_id}, index) => _id}
                    renderItem={({item}) => (
                      
                      <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => {
                          this.handleNavigate(item._id, item.projectName);
                        }}>
                        <Text style={styles.textStyle}>{item.projectName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                
                }
                

                {Platform.OS === 'android' ? (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Create a new project</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="Project name"
                        value={this.state.projectName}
                        onChangeText={(projectName) => this.setState({projectName})}/>
                      </View>


                      <View style={styles.buttonContainer}>
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
                          this.submitProject({projectName: this.state.projectName});
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Create</Text>
                      </TouchableHighlight>
                      </View>


                    </View>
                  </View>
                </Modal>
                ) : (
                  <WebModal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Create a new project</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                        keyboardType="default"
                        placeholder="Project name"
                        value={this.state.projectName}
                        onChangeText={(projectName) => this.setState({projectName})}/>
                      </View>
                      <View style={styles.buttonContainer}>
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
                          this.submitProject({projectName: this.state.projectName});
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.textStyle}>Create</Text>
                      </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                </WebModal>
                )}

                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {
                      this.setModalVisible(true);
                    }}
                />                
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#007eec"
          },
        buttonContainer: {
          flex: 1,
          flexDirection: 'row'
        },
        touchable: {
          width: 300,
          height: 60,
          borderColor: '#ffffff',
          borderWidth: 2,
          marginTop: 15,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111111',
          marginHorizontal: 'auto',
          backgroundColor: '#ffffff',
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
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
            elevation: 2,
            height: 40,
            margin: 20
          },
          textStyle: {
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20
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
            flexDirection: 'row'
          },
                 
    }
)

export default DashboardView;