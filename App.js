import React from 'react';
import { Provider } from "react-redux";
import store from "./store"
import { StyleSheet, Text, View } from 'react-native';
import Tabs from './src/components/Tab/router'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>

      <Tabs />

      </Provider>
    );
  }
}

