import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from "react-redux";
import store from '../../store'
import { Ionicons } from '@expo/vector-icons'
import { Google } from 'expo';
import axios from 'axios'


let mapStateToProps = (store) => {
    return {
        isSignedIn:store.data.isSignedIn,
        userInfo:store.data.userInfo
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
            isLogin: false,
            userData:{}
        }
    }




    render() {
        
        console.log("rendering")

        if(this.props.isSignedIn){

            const userInfo = this.props.userInfo

            return(
                <View style={styles.container}>
                <Image
                style={{
                    width:100,
                    height:100
                }}

                source={{uri: `${userInfo.photoUrl}`}}
                />

                <Text>Welcome {`${userInfo.name.givenName}, ${userInfo.name.familyName}! `}</Text>

                </View>
            )
        }


        return (
            <View style={styles.container}>
                <Text>Please sign in to begin</Text>
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