import React from 'react'
import { ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppHeader from '../../components/AppHeader'
import ComicScreen from '../../components/ComicScreen'

const Comics = () => {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <AppHeader />

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

export default Comics
