import {StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {Link} from 'expo-router';  
import { Redirect } from 'expo-router';


export default function App() {
  return (
    // <View style={styles.container} >
    //   <Text>Populus</Text>
    //   <StatusBar style="auto"/>
    //   <Link href="/home" style={ {color : 'blue'}}>Go to Home</Link>
    // </View>
    <Redirect href="/sign_in" />
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent: 'center',
  },
});
