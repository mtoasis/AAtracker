import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { connect } from "react-redux";
import store from '../../store'
import axios from 'axios'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


let mapStateToProps = (store) => {
    return {
        isSignedIn: store.data.isSignedIn,
        userInfo: store.data.userInfo
    }
}

const radio_props = [
    { label: 'rest', value: 'rest' },
    { label: 'gym', value: 'gym' },
    { label: 'study', value: 'study' }
];


class Schedule extends React.Component {

    constructor() {
        super()
        this.state = {
            times: [],
            schedule: [],
            clockCount: 18,
            isTimeArray: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: "Mark your schedule",
            headerRight: <Button style={{ backgroundColor: "red", width: 40, height: 20 }} title="Send" onPress={() => { params.sendPost() }} />,
            headerStyle: {
                backgroundColor: 'black',
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                color: "white"
            }
        }
    }

    componentDidMount() {

        this.initializeTimeArray()
        this.props.navigation.setParams({
            sendPost: this.sendPost.bind(this)
        });
    }

    initializeTimeArray() {
        console.log("running time array")
        for (var i = 6; i < 6 + this.state.clockCount; i++) {
            this.state.times.push(i)
        }

        for (var j = 0; j < this.state.clockCount; j++) {
            this.state.schedule.push(-1)
        }
        this.setState({
            isTimeArray: true,
        })
    }

    sendPost() {

        const schedule = this.state.schedule;
        const userInfo = this.props.userInfo;

        for (var i = 0, n = schedule.length; i < n; i++) {
            if (schedule[i] == -1) {
                console.log(`running with index${i}`)
                return (
                    Alert.alert("Please finish your mark")
                )
            }
        }
        console.log(schedule)


        const info = {
            userID: userInfo.id,
            name: `${userInfo.name.givenName}, ${userInfo.name.familyName}`,
            schedule: schedule
        }

        axios.post("https://aatserver.herokuapp.com/api/posts", info)
            .then(response => {
                console.log(response)
                this.initializeTimeArray()
            })

        return (
            Alert.alert("Post Sent")
        )

    }


    printRow() {
        console.log("running printRow")
        console.log(this.state.schedule)
        return (
            <View>

                {this.state.times.map((row, key) => {
                    return (
                        <View key={key} style={{ flexDirection: "row", marginTop: 30, marginLeft: 10, marginTop: 30 }}>
                            <Text>
                                {row < 10 ? `0${row}:00 AM ~ 0${row}:00 AM` : `${row}:00 PM ~ ${row}:00 PM`}
                            </Text>

                            <RadioForm
                                radio_props={radio_props}
                                initial={-1}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                animation={true}
                                onPress={(value) => {
                                    this.state.schedule[key] = value
                                    console.log(key)
                                    console.log(this.state.schedule)
                                }}
                            />
                        </View>

                    )
                }
                )}
            </View>
        )
    }




    render() {

        if (this.props.isSignedIn) {

            if (this.state.isTimeArray) {

                return (
                    <View style={styles.container}>
                        <ScrollView>

                            {this.printRow()}

                        </ScrollView>

                    </View>
                )
            }

            return (
                <View>
                    <Text>Loading</Text>
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

export default connect(mapStateToProps)(Schedule)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})