import React from 'react'
import { View, Image, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SignOutButton from '../../components/SignOutButton'
import ComicScreen from '../../components/ComicScreen'



const cart = () => {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      
      {/* Header Section */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <View className="w-10"/>
        <Image
          source={require("../../assets/icons/logo.png")}
          className="w-24 h-10 items-center"
        />
        <SignOutButton />
      </View>

      {/* Body Section */}
        <ImageBackground
          source={require("../../assets/images/imagebackground.png")}
          className="flex-1"
          resizeMode="cover"
        >

          {/* Body Content */}
          <ComicScreen />
          
        </ImageBackground>

    </SafeAreaView>
  )
}

export default cart