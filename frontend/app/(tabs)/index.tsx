import "../../global.css";
import SignOutButton from "../../components/SignOutButton";
import HomeScreen from "@/components/HomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { ImageBackground, View, Image, Text } from "react-native";

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

      <HomeScreen />

      </ImageBackground>
    </SafeAreaView>
  );
}
