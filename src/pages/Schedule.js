import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { connect } from "react-redux";
import store from '../../store'


let mapStateToProps = (store) => {
    return {
    }
}


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
        for (var i = 6; i < 6+this.state.clockCount; i++) {
            this.state.times.push(i)            
        }

        for (var j=0; j<this.state.clockCount; j++){
            this.state.schedule.push({state:null, buttonColorGym:"blue", buttonColorStudy:"blue"})
        }
        this.setState({ isTimeArray: true })
    }

    sendPost() {

        var schedule = this.state.schedule;

            for (var i = 0, n = this.state.schedule.length; i < n; i++) {
                if (schedule[i].state == null) {

                    return (
                        Alert.alert("Please finish your mark")
                    )
                }
            }
            console.log(this.state.schedule)
            return (
                Alert.alert("sending post...")
            )        
    }



    printRow() {
        console.log("running printRow")
        return (
            <View>
                <View style={{
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>                    

                </View>
                {this.state.times.map((row, key) => {
                    return (
                        <View key={key} style={{ flexDirection: "row", marginTop: 30, marginLeft: 10 }}>
                            <Text>
                                {row < 10 ? `0${row}:00 AM ~ 0${row}:00 AM` : `${row}:00 PM ~ ${row}:00 PM`}
                            </Text>

                            <TouchableOpacity style={
                                this.state.schedule[key].buttonColorStudy === "blue"?
                                styles.blueButton:styles.greyButton}  

                                onPress={() => {
                                    this.state.schedule[key].state = "gym";
                                    this.state.schedule[key].buttonColorGym = "blue"
                                    this.state.schedule[key].buttonColorStudy = "grey"
                                    // console.log(this.state.schedule)
                                    console.log(`${this.state.schedule[key].buttonColorGym}`)
                                }}

                            >
                                <Text style={{ color: "white" }}>Gym</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={
                                this.state.schedule[key].buttonColorStudy === "blue"?
                                styles.blueButton:styles.greyButton}                            

                                onPress={() => {
                                    this.state.schedule[key].state = "study";
                                    this.state.schedule[key].buttonColorGym = "grey"
                                    this.state.schedule[key].buttonColorStudy = "blue"
                                    console.log
                                    // console.log(`${this.state.schedule[key].buttonColorStudy}`)
                                }}

                            >
                                <Text style={{ color: "white" }}>Study</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                )}
            </View>
        )
    }


    render() {

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
    blueButton:{
        width: 100,
        height: 50,
        backgroundColor: "blue",
        marginLeft: 10
    },
    greyButton:{
        width: 100,
        height: 50,
        backgroundColor: "grey",
        marginLeft: 10
    }
})