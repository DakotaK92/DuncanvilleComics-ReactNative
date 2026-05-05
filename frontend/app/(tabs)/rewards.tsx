import React from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppHeader from '../../components/AppHeader'
import RewardsScreen from '../../components/RewardsScreen'

const Rewards = () => {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <AppHeader />

      {/* Body Section */}
      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >

        <View className="pt-4 px-4">
          <Text className="h-12 rounded bg-red-600 px-4 text-center font-gothamBold text-xl leading-[48px] text-white">
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
