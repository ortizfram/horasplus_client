import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const downloadQr = () => {
  return (
    <View style={styles.container}>
      <Text>downloadQr</Text>
    </View>
  )
}

export default downloadQr

const styles = StyleSheet.create({
 container: {
  flex: 1, // Set to flex: 1 to enable scrolling
  padding: 20,
  marginBottom: 80,
  marginTop: "2%",
  marginHorizontal: "8%",
},
})