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

    componentDidMount(){
              
    }

    fetchData(id){
        
        data = {id:id}

        axios.post("https://aatserver.herokuapp.com/api/findbyid",data)
            .then(response => {
                this.setState({userData:response.data})
                console.log(this.state.userData)
            })
        
    }

    _handleGoogleLogin = async () => {
        this.setState({ isButtonPressed: true })
        try {
            const { type, user } = await Google.logInAsync({
                // androidStandaloneAppClientId: 'null',
                // iosStandaloneAppClientId: 'null',
                androidClientId: "760596499772-5iok8om0kboc9e5g5f3ncj9ist99mkr8.apps.googleusercontent.com",
                iosClientId: "760596499772-rr3hiui3lfg5n22ib29kies5uiscucal.apps.googleusercontent.com",
                scopes: ['profile', 'email']
            });

            switch (type) {
                case 'success': {
                    Alert.alert(
                        'Logged in!',
                        `Hi ${user.name}!`,
                    );

                    const info = {
                        name: {
                            familyName: user.familyName,
                            givenName: user.givenName
                        },
                        id: user.id,
                        email: user.email,
                        photoUrl: user.photoUrl
                    }

                    store.dispatch({
                        type: "STORE_USER",
                        payload: info
                      }).then(()=>{

                        console.log(this.props.userInfo)

                        this.fetchData(info.id)   
                      })
                 

                    break;
                }
                case 'cancel': {
                    Alert.alert(
                        'Cancelled!',
                        'Login was cancelled!',
                    );
                    break;
                }
                default: {
                    Alert.alert(
                        'Oops!',
                        'Login failed!',
                        'default',
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                'Oops!',
                'Login failed!',
                'error',
            );
        }
    };


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
                <TouchableOpacity style={{ width: 230, height: 50, backgroundColor: "tomato", borderColor: "#800000", borderWidth: 1 }} onPress={this._handleGoogleLogin.bind(this)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <Ionicons name="logo-google" size={35} color="white" />
                        <Text style={{ fontSize: 16, color: "white", marginLeft: 5, fontWeight: "bold" }}>Login Using Google </Text>
                    </View>
                </TouchableOpacity>
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