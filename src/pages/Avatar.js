import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import store from '../../store'


let mapStateToProps = (store) => {
    return {
    }
}

class Avatar extends React.Component {


    static navigationOptions = {
        title: "Avatar",
        headerStyle: {
            backgroundColor: 'black',
            borderBottomWidth: 0,
        },
        headerTitleStyle: {
            color: "white"
        },
    };

    constructor() {
        super()
        this.state = {
            message: null,
        }
    }


    render() {


        return (
            <View style={styles.container}>
                <Text>Avatar</Text>
            </View>
        )

    }
}

export default connect(mapStateToProps)(Avatar)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    }
})