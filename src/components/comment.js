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
  
        
        await this.props.updateData();
        
    }    
    componentDidMount() {
        console.log('comments: ')
        console.log(this.props.data)
    }

    render() {
        return(
        <View>
            {this.props.data ? 
            <FlatList
            data={this.props.data}
            keyExtractor={({_id}, index) => _id}
            renderItem={({comment}) => (
                
            <View>
                <Text>{this.props.mapUser(comment.commenter) + ' : ' + comment.addedDate.toString()}</Text>
                <Text>{comment.commentText}</Text>
            </View>
            )} /> :
            <Text>There are currently no comments</Text>     
            }

            <TextInput 
            style={styles.inputs} 
            keyboardType="default" 
            value={this.state.commentText} 
            onChangeText={(commentText) => {this.setState({commentText})}}/> 
            <Button style={styles.button} onPress={()=> this.postComment()}>Post</Button>
        </View>
        )
    }
} 

export default CommentsSection;

const styles = StyleSheet.create({
    inputs:{
        //textAlign: 'center',
        width: 300,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 30,
      },
      button:{
        width: '85%',
        height: 60,
        justifyContent: 'center',
        borderRadius: 40,
      }
})