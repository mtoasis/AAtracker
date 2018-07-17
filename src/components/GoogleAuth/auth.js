import { Google } from 'expo';
import React, { Component } from 'react';
import { Alert, View, Text, TouchableOpacity } from "react-native";
import axios from 'axios'
import store from "../../../store"
import { Ionicons } from '@expo/vector-icons'

export default class GoogleAuth extends Component {

  constructor() {
    super()
    this.state = {
    }
  }

  _handleGoogleLogin = async () => {
    this.setState({ isButtonPressed: true })
    try {
      const { type, user } = await Google.logInAsync({
        androidStandaloneAppClientId: '360376856742-5t2b376blpap03u21q4vogadgd7675f1.apps.googleusercontent.com',
        iosStandaloneAppClientId: '360376856742-jd1jorti1pjjeges8sl5ogae71d0md63.apps.googleusercontent.com',
        androidClientId: '360376856742-5t2b376blpap03u21q4vogadgd7675f1.apps.googleusercontent.com',
        iosClientId: '360376856742-jd1jorti1pjjeges8sl5ogae71d0md63.apps.googleusercontent.com',
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
          console.log(info)

          // axios.post("http://toolntool.herokuapp.com/auth/mobile", info)
          //   .then(response => {
          //     this.setState({ userInfo: response.data })
          //     let res = store.dispatch({
          //       type: "STORE_USER",
          //       payload: response.data
          //     })
          //     getConversation(this.state.userInfo._id, true)
          //   })
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

     return (

        <TouchableOpacity style={{ width: 230, height: 50, backgroundColor: "tomato", borderColor: "#800000", borderWidth: 1 }} onPress={this._handleGoogleLogin.bind(this)}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <Ionicons name="logo-google" size={35} color="white" />
            <Text style={{ fontSize: 16, color: "white", marginLeft: 5, fontWeight: "bold" }}>Login Using Google </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

