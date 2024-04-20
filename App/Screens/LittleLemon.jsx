import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LittleLemonHeader from '../Components/LittleLemonHeader'
import LittleLemonFooter from '../Components/LittleLemonFooter'
import WelcomeScreen from './WelcomeScreen'
import MenuItem from '../Screens/MenuItem'

const LittleLemon = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LittleLemonHeader />
      {/* <WelcomeScreen /> */}
      <MenuItem />
      <LittleLemonFooter />
    </SafeAreaView>
  )
}

export default LittleLemon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#495E57",
    marginTop: 20
  },
})