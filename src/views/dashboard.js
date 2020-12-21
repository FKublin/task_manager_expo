import React from 'react';
import { StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    Alert,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import Modal from 'modal-react-native-web';
import {Button} from 'react-native-elements';
import config from '../config.json';
import { MaterialIcons } from '@expo/vector-icons';

    
class DashboardView extends React.Component{

    static navigationOptions = {
        title: 'Dashboard',
        header: null

    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            projectName: '',
            modalVisible: false
        }
    }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }

    submitProject = async (data) => {
      var token = await AsyncStorage.getItem('token');
      fetch('http://127.0.0.1:3000/api/projects', {
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
      fetch('http://127.0.0.1:3000/api/projects', {
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
          this.getData();
        });
    }

    render() {
      const { modalVisible } = this.state;

        return(
            <View style={styles.container}>
                
                {this.state.data.length == 0 ? (
                    <Text>You do not belong to any projects at the moment. Creat one with the button below or ask for an invitation</Text>
                ) : (
                    <FlatList
                    data={this.state.data}
                    keyExtractor={({_id}, index) => _id}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => {
                          this.handleNavigate(item._id, item.projectName);
                        }}>
                        <Text style={styles.white}>{item.projectName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )
                }
                
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
                </Modal>

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
            flexDirection: 'row'
          },
                 
    }
)

export default DashboardView;