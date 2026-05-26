import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { comics, Comic } from "../data/comics";

const [featuredComic, ...moreComics] = comics;

const ComicScreen = () => {
  return (
    <FlatList
      data={moreComics}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <ComicCard comic={item} />}
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 20 }}
      columnWrapperStyle={{ gap: 12 }}
      ListHeaderComponent={
        <View className="pb-5">
          <View className="rounded-2xl bg-red-600 px-5 py-5">
            <View className="self-start">
              <Text className="font-gothamBold text-2xl text-white">Best Comics to Read</Text>
              <View className="mt-2 h-1.5 rounded-full bg-white/90" />
            </View>
            <Text className="mt-3 font-gothamLight text-sm leading-5 text-red-100">
              A curated stack of all-time favorites, strong jumping-on points, and books we would
              hand to someone who wants to leave the shop excited.
            </Text>
          </View>

          <View className="mt-4 overflow-hidden rounded-2xl bg-white">
            <ImageBackground
              source={featuredComic.image}
              className="h-[230px] justify-between px-5 py-5"
              imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              <View className="self-start rounded-full bg-red-600 px-3 py-1.5">
                <Text className="font-gothamBold text-xs uppercase tracking-[1px] text-white">
                  Featured Read
                </Text>
              </View>

              <View className="self-start rounded-full bg-black/55 px-3 py-1.5">
                <Text className="font-gothamMedium text-xs text-white">{featuredComic.genre}</Text>
              </View>
            </ImageBackground>

            <View className="p-5">
              <View className="flex-row flex-wrap gap-2">
                {featuredComic.awards?.map((award) => (
                  <AwardBadge key={`${featuredComic.id}-${award.label}`} award={award} />
                ))}
              </View>

              <Text className="mt-4 font-gothamBold text-2xl text-neutral-950">
                {featuredComic.title}
              </Text>
              <Text className="mt-1 font-gothamMedium text-sm text-red-600">
                {featuredComic.publisher}
              </Text>
              <Text className="mt-3 font-gothamLight text-sm leading-6 text-neutral-700">
                {featuredComic.pitch}
              </Text>

              <View className="mt-4 rounded-xl bg-red-50 p-4">
                <Text className="font-gothamBold text-xs uppercase tracking-[1px] text-red-700">
                  Why it lands
                </Text>
                <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-700">
                  {featuredComic.readerNote}
                </Text>
              </View>

              <View className="mt-4 flex-row gap-3">
                <ActionButton
                  label="Back Issues"
                  icon="library"
                  variant="primary"
                  onPress={() => router.push("/category/back-issues")}
                />
                <ActionButton
                  label="Wish List"
                  icon="heart"
                  variant="secondary"
                  onPress={() => router.push("/category/wish-list")}
                />
              </View>
            </View>
          </View>

          <View className="mt-5 rounded-2xl bg-red-600 px-5 py-5">
            <View className="self-start">
              <Text className="font-gothamBold text-xl text-white">More Great Picks</Text>
              <View className="mt-2 h-1.5 w-16 rounded-full bg-white" />
            </View>
            <Text className="mt-3 font-gothamLight text-sm text-white">
              Staff favorites, classics, and books worth chasing down.
            </Text>
          </View>
        </View>
      }
    />
  );
};

const ComicCard = ({ comic }: { comic: Comic }) => {
  return (
    <Pressable
      onPress={() => router.push("/category/back-issues")}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      className="mb-3 flex-1 overflow-hidden rounded-2xl bg-white"
    >
      <Image
        source={comic.image}
        style={{ height: 208, width: "100%", backgroundColor: "#e5e5e5" }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={180}
      />

      <View className="p-4">
        <View className="flex-row flex-wrap gap-2">
          {comic.awards?.slice(0, 2).map((award) => (
            <AwardBadge key={`${comic.id}-${award.label}`} award={award} compact />
          ))}
        </View>

        <Text className="mt-3 font-gothamBold text-lg leading-6 text-neutral-950">
          {comic.title}
        </Text>
        <Text className="mt-1 font-gothamMedium text-xs uppercase tracking-[1px] text-red-600">
          {comic.publisher}
        </Text>
        <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-600">
          {comic.pitch}
        </Text>

        <View className="mt-4 rounded-xl bg-neutral-100 px-3 py-3">
          <Text className="font-gothamMedium text-xs text-neutral-700">{comic.readerNote}</Text>
        </View>
      </View>
    </Pressable>
  );
};

function AwardBadge({
  award,
  compact,
}: {
  award: Comic["awards"][number];
  compact?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center self-start rounded-full ${
        compact ? "bg-red-100 px-2.5 py-1" : "bg-yellow-300/95 px-3 py-1.5"
      }`}
    >
      {award.icon ? (
        <Ionicons
          name={award.icon as keyof typeof Ionicons.glyphMap}
          size={compact ? 11 : 13}
          color={compact ? "#b91c1c" : "#111827"}
        />
      ) : null}
      <Text
        className={`${
          award.icon ? "ml-1.5" : ""
        } font-gothamBold text-xs ${compact ? "text-red-700" : "text-black"}`}
      >
        {award.label}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  variant,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: "primary" | "secondary";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center rounded-xl px-4 py-3 ${
        variant === "primary" ? "bg-red-600" : "border border-neutral-200 bg-white"
      }`}
    >
      <Ionicons
        name={icon}
        size={16}
        color={variant === "primary" ? "#ffffff" : "#1f2937"}
      />
      <Text
        className={`ml-2 font-gothamMedium text-sm ${
          variant === "primary" ? "text-white" : "text-neutral-800"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default ComicScreen;
