import "../../global.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View, Image } from "react-native";

import SignOutButton from "../../components/SignOutButton";
import HomeScreen from "@/components/HomeScreen";

export default function Index() {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      
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

      {/*Content in Body*/}
      <HomeScreen />
      
      </ImageBackground>
    </SafeAreaView>
  );
}
