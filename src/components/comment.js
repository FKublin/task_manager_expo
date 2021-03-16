import React from 'react'
import {View, 
        Modal, 
        Text,  
        TouchableHighlight, TouchableOpacity,
        Platform, 
        StyleSheet, FlatList, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';           
import {Button} from 'react-native-elements'


class CommentsSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            commentText: ''
        }
    }

    postComment = async() => {
        var token = await AsyncStorage.getItem('token');
        fetch(this.props.serverUrl + 'projects/' + this.props.projectId + '/tasks/' + this.props.taskId + '/comments', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            commentText: this.state.commentText
          }),
        }).then(this.props.updateData())
        .catch(error => console.error(error));;
  
        this.setState({commentText: ''});
        await this.props.updateData();
        
    }

    componentDidMount() {
      this.setState({comments: this.props.data})
    }

    render() {
        return(
        <View>
            {this.props.data.length > 0 ? 
            <FlatList
            data={this.props.data}
            keyExtractor={({_id}, index) => _id}
            renderItem={({item}) => (
            <View style={{flexDirection:'column', justifyContent: 'flex-start', marginBottom: 10}}>
                <Text style={{textAlign:'left'}}>{this.props.mapUser(item.commenter) + ' '
                 + new Date(item.addedDate).getDate() + '/' + (parseInt(new Date(item.addedDate).getMonth(), 10) + 1) + '/' 
                 + new Date(item.addedDate).getFullYear() }</Text>
                <Text style={{textAlign:'left', fontSize: 15}}>{item.commentText}</Text>
            </View>
            )} /> :
            <Text>There are currently no comments</Text>     
            }
            <View style={{flexDirection: 'row', height: 60, alignContent: 'space-between', paddingTop: 20}}>
            <TextInput 
            style={styles.inputs} 
            keyboardType="default" 
            value={this.state.commentText} 
            onChangeText={(commentText) => {this.setState({commentText})}}/> 
            <Button style={styles.button} mode="contained" onPress={() => this.postComment()} title="Post" >Post</Button>
            </View>
        </View>
        )
    }
} 

export default CommentsSection;

const styles = StyleSheet.create({
    inputs:{
        width: 200,
        height: 45,
        color: 'black',
        backgroundColor: 'white',
        
        marginBottom: 30,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
      },
      button:{
        width: 50,
        height: 45,
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 40,
      },
      
})