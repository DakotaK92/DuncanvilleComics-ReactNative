import React from 'react'
import { ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../../components/AppHeader'
import UpComingEventScreen from '../../components/UpComingEventsPage'

const Events = () => {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <AppHeader />

      {/* Body Section */}
      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >
        {/*Content in Body*/}
        <UpComingEventScreen />
        
      </ImageBackground>

    </SafeAreaView>
  )
}

export default Events
