import { View, FlatList, Image, Text } from "react-native";
import { comics } from "../data/comics";

const ComicCard = ({ comic }: { comic: Comic }) => {
  return (
    <View className="w-1/2 p-2">
      <View className="bg-white rounded-xl overflow-hidden p-2 shadow">
        <Image
          source={comic.image}
          className="w-full h-48 mb-2 rounded"
          resizeMode="contain"
        />
        <Text className="text-lg font-gothamBold text-center">
          {comic.title}
        </Text>
      </View>
    </View>
  );
};

const ComicScreen = () => {
  return (
    <FlatList
      data={comics}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 8 }}
      renderItem={({ item }) => <ComicCard comic={item} />}
    />
  );
};

export default ComicScreen;
