import "../../global.css";

import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View, Image, Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

import SignOutButton from "../../components/SignOutButton";
import HomeScreen from "@/components/HomeScreen";

export default function Index() {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      
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
          <Text className="text-2xl font-gothamBold text-center  text-white bg-red-500/80 py-2 rounded">
            IN STORE COMIC EVENTS
          </Text>
        </View>

      {/*Content in Body*/}
      <HomeScreen />
      
      </ImageBackground>
    </SafeAreaView>
  );
}
