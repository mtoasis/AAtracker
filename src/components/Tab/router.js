import React from 'react';
import {createStackNavigator, createBottomTabNavigator  } from 'react-navigation';
import Schedule from '../../pages/Schedule'
import Avatar from '../../pages/Avatar'
import { Ionicons } from '@expo/vector-icons';



const ScheduleStack = createStackNavigator({
    Schedule: { screen: Schedule }    
})

const AvatarStack = createStackNavigator({
    Avatar: { screen: Avatar }    
})


export default Tabs = createBottomTabNavigator(

    {    
        Avatar: { screen: AvatarStack }, 
        Schedule: { screen: ScheduleStack }, 

    },
    {
        navigationOptions: ({ navigation }) => ({            
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Avatar') {
                    iconName = `ios-body${focused ? '' : '-outline'}`;
                }
                else if (routeName === 'Schedule') {
                    iconName = `ios-american-football${focused ? '' : '-outline'}`;
                }

                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'black',
            inactiveTintColor: 'gray',
        },
        animationEnabled: false,
        swipeEnabled: true,        
    }
);

