import { View, FlatList } from "react-native";
import { comics } from "../data/comics";

const ComicScreen = () => {
  return (
    <View className="flex-1 bg-gray-100 pt-4">
      <FlatList
        data={comics}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ComicCard comic={item} />
        )}
      />
    </View>
  );
};

export default ComicScreen;
