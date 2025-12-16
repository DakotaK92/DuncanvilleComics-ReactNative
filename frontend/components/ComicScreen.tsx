import { View, FlatList, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { comics } from "../data/comics";

type Award = {
  icon: any;
  label: string;
  color: string;
};

type Comic = {
  id: string;
  title: string;
  image: any;
  awards?: Award[];
};

const ComicCard = ({ comic }: { comic: Comic }) => {
  return (
    <View className="w-1/2 p-2">
      <View className="bg-white rounded-xl overflow-hidden p-2 shadow-lg relative">
        {/* Awards Stack */}
        {comic.awards && comic.awards.length > 0 && (
          <View className="absolute top-2 left-2 space-y-1 z-10">
            {comic.awards.map((award, index) => (
              <View
                key={index}
                className="bg-yellow-400/90 px-2 py-1 rounded-full flex-row items-center"
              >
                {award.icon && (
                  <Ionicons
                    name={award.icon as any}
                    size={12}
                    color="black"
                    className="mr-1"
                  />
                )}
                <Text className="text-xs font-gothamBold text-black">{award.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Image
          source={comic.image}
          className="w-full h-48 mb-2 rounded"
          resizeMode="cover"
        />
        <Text className="text-lg font-gothamBold text-center">{comic.title}</Text>
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
      renderItem={({ item }) => <ComicCard comic={item} />}
    />
  );
};

export default ComicScreen;
