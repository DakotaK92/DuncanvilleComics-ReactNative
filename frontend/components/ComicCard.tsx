import { View, Text, Image, TouchableOpacity } from "react-native";
import { ComicBook } from "../data/categoryComics";

export function ComicCard({ comic }: { comic: ComicBook }) {
  return (
    <TouchableOpacity className="flex-row mb-4 bg-white rounded-lg shadow overflow-hidden">
      <Image
        source={comic.coverImage}
        className="w-24 h-36"
        resizeMode="cover"
      />

      <View className="flex-1 p-3">
        <Text className="font-bold">{comic.title} #{comic.issue}</Text>
        <Text className="text-gray-500">{comic.publisher}</Text>

        {comic.grade && (
          <Text className="text-green-600 mt-1">
            CGC {comic.grade}
          </Text>
        )}

        {comic.dealPrice ? (
          <View className="flex-row mt-2">
            <Text className="line-through text-gray-400 mr-2">
              ${comic.price.toFixed(2)}
            </Text>
            <Text className="text-red-600 font-bold">
              ${comic.dealPrice.toFixed(2)}
            </Text>
          </View>
        ) : (
          <Text className="mt-2 font-semibold">
            ${comic.price.toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
