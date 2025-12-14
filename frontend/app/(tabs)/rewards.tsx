import React from 'react'
import { Text, View, Image, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import AntDesign from '@expo/vector-icons/build/AntDesign'

const rewards = () => {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      {/* Header Section */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <AntDesign name="menu" size={24} color="black" />
        <Image
          source={require("../../assets/icons/logo.png")}
          className="w-24 h-10"
        />
        <SignOutButton />
      </View>

      {/* Body Section */}
      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >

        <View className="pt-4 px-4">
          <Text className="text-2xl font-gothamBold text-center mb-1 text-white bg-green-500/80 py-2 rounded">
            TCG, TOURNAMENTS AND EVENTS
          </Text>
        </View>
    
      </ImageBackground>
    </SafeAreaView>
  )
}

export default rewards