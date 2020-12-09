import React from 'react';
import { StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert } from 'react-native';

    
class DashboardView extends React.Component{

    static navigationOptions = {
        title: 'Dashboard',
        header: null

    };

    render() {
        return(
            <View>
                <Text>
                    This will be the dashboard
                </Text>
            </View>
        )
    }
}

export default DashboardView;