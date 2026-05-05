import { Image, View } from "react-native";

import HeaderMenuButton from "./HeaderMenuButton";

const AppHeader = () => {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
      <View className="h-10 w-10" />
      <Image
        source={require("../assets/icons/logo.png")}
        className="h-10 w-24 items-center"
      />
      <HeaderMenuButton />
    </View>
  );
};

export default AppHeader;
