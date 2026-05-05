import "../../global.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";

import AppHeader from "../../components/AppHeader";
import HomeScreen from "@/components/HomeScreen";

export default function Index() {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <AppHeader />

      {/* Body Section */}
      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >

      {/*Content in Body*/}
      <HomeScreen />
      
      </ImageBackground>
    </SafeAreaView>
  );
}
