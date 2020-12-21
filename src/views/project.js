import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {List, Checkbox, FAB} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import config from '../config.json';


class ProjectView extends React.Component{
    id = {projectId: this.props.route.params.user};
    projectName = {projectName: this.props.route.params.name};
  
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          isLoading: true,
          checked: false,
          checkboxes: [],
        };
        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => {
                //this.navigateToProductListSettings();
              }}>
              <Icon name="settings" color="#ffffff" />
            </TouchableOpacity>
          ),
        });
      }

      getData = async () => {
        const {projectId} = this.id;
        var token = await AsyncStorage.getItem('token');
        const url = config.backendUrl + 'projects/' + projectId + '/tasks';
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
            this.setState({data: json});
          })
          .catch(error => console.error(error))
          .finally(() => {
            this.setState({isLoading: false});
          });
      };  

    render() {
        const {data} = this.state;
        const {projectId} = this.id;
        const {projectName} = this.projectName;
        const {checked} = this.state;
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
                      <List.Item title="Quantity" description={item.quantity} />
                      <List.Item
                        title="Description"
                        description={item.description}
                      />
                      <TouchableOpacity
                        style={styles.insideBtn}
                        title="123"
                        onPress={() => {
                          this.taskId = item._id;
                          //this.deleteProduct();
                        }}>
                        <Icon name="delete" color="#ffffff" />
                      </TouchableOpacity>
                    </List.Accordion>
                  </List.Section>
                  <Checkbox
                    style={styles.checkbox}
                    status={item.isBought ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.taskId = item._id;
                      //this.setChecked(item.isBought);
                    }}
                  />
                </View>
              )}
            />
            <FAB
              style={styles.fab}
              icon="account-plus"
              onPress={() => {
                //this.navigateToAddUserToBasket();
              }}
            />
            <FAB
              style={styles.fab2}
              icon="cart-plus"
              onPress={() => {
                //this.navigateToAddProduct();
              }}
            />
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
      right: 90,
      bottom: 10,
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
  });

export default ProjectView;