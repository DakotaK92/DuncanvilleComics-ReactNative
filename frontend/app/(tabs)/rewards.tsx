import React from 'react'
import { Text, View, Image, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutButton from '../../components/SignOutButton'
import AntDesign from '@expo/vector-icons/build/AntDesign'

import RewardsScreen from '../../components/RewardsScreen'

const Rewards = () => {
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

        <View className="pt-4 px-4">
          <Text className="text-2xl font-gothamBold text-center  text-white bg-red-600 py-2 rounded">
            EARN & REDEEM REWARDS
          </Text>
        </View>

      {/*Content in Body*/}
      <RewardsScreen />
      
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Rewards