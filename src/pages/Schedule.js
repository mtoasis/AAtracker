import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { connect } from "react-redux";
import store from '../../store'
import axios from 'axios'
import { SegmentedControls } from 'react-native-radio-buttons'
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons'
import { Google } from 'expo';

let mapStateToProps = (store) => {
    return {
        isSignedIn: store.data.isSignedIn,
        userInfo: store.data.userInfo
    }
}

const options = [
    "Academic",
    "Atheletic"
];


class Schedule extends React.Component {

    constructor() {
        super()
        this.state = {
            times: [],
            schedule: [],
            clockCount: 18,
            isTimeArray: false,
            isSent: false,
            surveyQs: {},
            surveyA1: {},
            surveyA2: {},
            visibleModal: null,
            isSurveyReady: false,
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

                    let res = async = store.dispatch({
                        type: "STORE_USER",
                        payload: info
                      })

                        console.log(this.props.userInfo)

                        // this.fetchData(this.props.userInfo.id)

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

    fetchingSurvey() {
        console.log("fetching survey")
        axios.get("https://aatserver.herokuapp.com/api/survey")
            .then(response => {
                console.log(response.data)
                this.setState({ isSurveyReady: true })
                this.setState({ surveyQs: response.data[0] })
                console.log(this.state.surveyQs)

            })
    }

    componentDidMount() {

        this.initializeTimeArray()
        this.props.navigation.setParams({
            sendPost: this.sendPost.bind(this)
        });
        this.fetchingSurvey()
    }

    initializeTimeArray() {

        for (var i = 6; i < 6 + this.state.clockCount; i++) {
            this.state.times.push(i)
        }

        for (var j = 0; j < this.state.clockCount; j++) {
            this.state.schedule.push(null)
        }
        this.setState({
            isTimeArray: true,
        })
    }

    callNextQ(choice) {
        // this.state.surveyAs.q1.c = choice
        console.log(choice)
        // console.log(this.state.surveyAs)

        return (
            Alert.alert(`your choice:${choice}`)
        )
        // Alert.alert(

        // )
    }

    sendPost() {
        if (this.props.isSignedIn && !this.state.isSent) {
            this.setState({ visibleModal: 3 })
        }
        else if (this.props.isSignedIn && this.state.isSent){
            Alert.alert("Your schedule was already sent")
        }
        else {
            Alert.alert("Please sign in")
        }



    }

    postingData() {
        console.log(this.state.surveyA1)
        console.log(this.state.surveyA2)

        const schedule = this.state.schedule;
        const userInfo = this.props.userInfo;

        const info = {
            userID: userInfo.id,
            name: `${userInfo.name.givenName}, ${userInfo.name.familyName}`,
            schedule: schedule,
            surveyQA: {
                q1: this.state.surveyA1.question,
                c1: this.state.surveyA1.choice,
                q2: this.state.surveyA2.question,
                c2: this.state.surveyA2.choice,
            }
        }

        axios.post("https://aatserver.herokuapp.com/api/posts", info)
            .then(response => {
                console.log(response.data)
                // this.setState({ visibleModal: null }) //deleted due to unmounted component should not have setState
                this.setState({ isSent: true })
                console.log(`isSent:${this.state.isSent}`)
            })

        return (
            Alert.alert("Post Sent")
        )
    }




    printRow() {

        return (
            <View>

                {this.state.times.map((row, key) => {

                    return (
                        <View key={key} style={{ marginTop: 5 }}>
                            <Text style={{ alignSelf: 'center', fontSize: 15 }}>
                                {row == 11 ?

                                    `${row}:00 AM ~ ${row + 1}:00 PM` :

                                    row < 12 ?

                                        `${row}:00 AM ~ ${row + 1}:00 AM` :

                                        `${row}:00 PM ~ ${row + 1}:00 PM`}

                            </Text>

                            <SegmentedControls
                                options={options}
                                onSelection={(selectedOption) => {
                                    this.state.schedule[key] = selectedOption;
                                    console.log(this.state.schedule);
                                }}
                            />
                        </View>

                    )
                }
                )}
            </View>
        )
    }

    qOneModal() {

        const surveyQs = this.state.surveyQs
        return (
            <Modal isVisible={this.state.visibleModal === 1}>

                <View style={styles.modalContent}>
                    <Text>{`Question1: ${surveyQs.q1.q}`}</Text>
                    <TouchableOpacity onPress={() => {
                        console.log(this.state)

                        this.setState({
                            visibleModal: 2,
                            surveyA1: {
                                question: surveyQs.q1.q,
                                choice: surveyQs.q1.c1
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q1.c1}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 2,
                            surveyA1: {
                                question: surveyQs.q1.q,
                                choice: surveyQs.q1.c2
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q1.c2}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 2,
                            surveyA1: {
                                question: surveyQs.q1.q,
                                choice: surveyQs.q1.c3
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q1.c3}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 2,
                            surveyA1: {
                                question: surveyQs.q1.q,
                                choice: surveyQs.q1.c4
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q1.c4}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 2,
                            surveyA1: {
                                question: surveyQs.q1.q,
                                choice: surveyQs.q1.c5
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q1.c5}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    qTwoModal() {

        const surveyQs = this.state.surveyQs
        return (
            <Modal isVisible={this.state.visibleModal === 2}>
                <View style={styles.modalContent}>
                    <Text>{`Question2: ${surveyQs.q2.q}`}</Text>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 4,
                            surveyA2: {
                                question: surveyQs.q2.q,
                                choice: surveyQs.q2.c1
                            }
                        })
                    }}
                    >
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q2.c1}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 4,
                            surveyA2: {
                                question: surveyQs.q2.q,
                                choice: surveyQs.q2.c2
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q2.c2}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 4,
                            surveyA2: {
                                question: surveyQs.q2.q,
                                choice: surveyQs.q2.c3
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q2.c3}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 4,
                            surveyA2: {
                                question: surveyQs.q2.q,
                                choice: surveyQs.q2.c4
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q2.c4}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({
                            visibleModal: 4,
                            surveyA2: {
                                question: surveyQs.q2.q,
                                choice: surveyQs.q2.c5
                            }
                        })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>{surveyQs.q2.c5}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    sendingModal() {
        return (
            <Modal isVisible={this.state.visibleModal === 3}>
                <View style={styles.modalContent}>
                    <Text>Would you like to send?</Text>

                    <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: 1 })
                    }}
                    >
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>Yes</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: null })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Modal>
        )
    }

    reviewModal() {
        return (
            <Modal isVisible={this.state.visibleModal === 4}>
                <View style={styles.modalContent}>
                    <Text>Review Survey</Text>
                    <Text>{`Question 1: ${this.state.surveyA1.question}`}</Text>
                    <Text style={{ marginBottom: 5 }}>{`Your answer: ${this.state.surveyA1.choice}`}</Text>
                    <Text>{`Question 2: ${this.state.surveyA2.question}`}</Text>
                    <Text>{`Your answer: ${this.state.surveyA2.choice}`}</Text>

                    <TouchableOpacity onPress={() => {
                        this.postingData()
                    }}
                    >
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>Confirm</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: null })
                    }}>
                        <View style={styles.modalButton}>
                            <Text style={styles.modalText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Modal>
        )
    }



    render() {

        if (this.props.isSignedIn && !this.state.isSent) {

            if (this.state.isTimeArray) {

                if (this.state.isSurveyReady) {
                    return (
                        <ScrollView>

                            {this.printRow()}
                            {this.qOneModal()}
                            {this.qTwoModal()}
                            {this.sendingModal()}
                            {this.reviewModal()}

                        </ScrollView>
                    )
                }

                return (
                    <View>
                        <Text>Loading</Text>
                    </View>
                )
            }

            return (
                <View>
                    <Text>Loading</Text>
                </View>
            )
        }

        else if (this.state.isSent) {

            return (
                <View style={styles.container}>
                    <Text>Thank you for your contribution!</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <Text>Please sign in to begin</Text>

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

export default connect(mapStateToProps)(Schedule)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalButton: {
        backgroundColor: 'black',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalText: {
        color: "white"
    }
})