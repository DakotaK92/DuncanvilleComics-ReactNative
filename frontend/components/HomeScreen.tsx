import React from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { messages, HomeTypes } from "../data/home";

const spotlightTypes: HomeTypes["type"][] = [
  "weekly-releases",
  "pull-list",
  "deals",
];

const quickLinks = [
  {
    label: "Weekly Pulls",
    subtitle: "This week's books",
    icon: "sparkles",
    type: "weekly-releases" as HomeTypes["type"],
  },
  {
    label: "My Pull List",
    subtitle: "Saved series",
    icon: "albums",
    type: "pull-list" as HomeTypes["type"],
  },
  {
    label: "Rewards",
    subtitle: "Coins and perks",
    icon: "trophy",
    route: "/rewards",
  },
];

const socialLinks = [
  {
    icon: require("../assets/icons/instagram.png"),
    url: "https://www.instagram.com/duncanville.bookstore",
    label: "Instagram",
  },
  {
    icon: require("../assets/icons/facebook.png"),
    url: "https://www.facebook.com/Duncanville.Bookstore",
    label: "Facebook",
  },
  {
    icon: require("../assets/icons/tiktok.png"),
    url: "https://www.tiktok.com/@duncanville.bookstore",
    label: "TikTok",
  },
  {
    icon: require("../assets/icons/ebay.png"),
    url: "https://www.ebay.com/str/duncanvillebookstore",
    label: "eBay",
  },
  {
    icon: require("../assets/icons/youtube.png"),
    url: "https://www.youtube.com/@duncanvillebookstore",
    label: "YouTube",
  },
];

const storeHighlights = [
  { label: "Open Daily", value: "10 AM - 7 PM" },
  { label: "Pull List Ready", value: "Weekly updates" },
  { label: "In Store", value: "Comics, toys, collectibles" },
];

const spotlightItems = messages.filter((item) => spotlightTypes.includes(item.type));

const HomeScreen = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  const openCategory = (type: HomeTypes["type"]) => {
    router.push({
      pathname: "/category/[type]",
      params: { type },
    });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("../assets/images/store-front.jpg")}
        className="min-h-[320px] overflow-hidden rounded-xl"
        imageStyle={{ borderRadius: 12 }}
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/55 px-5 py-5">
          <View className="self-start rounded-full bg-red-600 px-3 py-2">
            <Text className="font-gothamMedium text-xs uppercase tracking-[1px] text-white">
              Your Local Comic Shop
            </Text>
          </View>

          <View className="mt-6 max-w-[85%]">
            <Text className="font-gothamBold text-3xl leading-9 text-white">
              Duncanville Comics, Toys and Collectibles
            </Text>
            <Text className="mt-3 font-gothamLight text-sm leading-5 text-neutral-200">
              Keep up with weekly books, manage your pull list, and stay close to what is new in
              the shop.
            </Text>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-2">
            <InfoPill icon="location" text="101 W Camp Wisdom Rd, Suite J" />
            <InfoPill icon="time" text="Open daily 10 AM - 7 PM" />
            <InfoPill icon="call" text="Call the shop" />
          </View>

          <View className="mt-auto flex-row gap-3 pt-6">
            <PrimaryAction
              label="Browse Weekly Releases"
              onPress={() => openCategory("weekly-releases")}
            />
            <SecondaryAction label="View Pull List" onPress={() => openCategory("pull-list")} />
          </View>
        </View>
      </ImageBackground>

      <View className="mt-5">
        <Text className="font-gothamBold text-xl text-white">Quick Start</Text>
        <Text className="mt-1 font-gothamLight text-sm text-neutral-300">
          Jump into the parts of the app you will probably use first.
        </Text>
      </View>

      <View className="mt-4 flex-row gap-3">
        {quickLinks.map((item) => (
          <Pressable
            key={item.label}
            onPress={() =>
              item.type ? openCategory(item.type) : router.push(item.route as "/rewards")
            }
            className="min-h-[126px] flex-1 rounded-xl bg-white/10 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-600">
              <Ionicons name={item.icon as never} size={18} color="#fff" />
            </View>
            <Text className="mt-4 font-gothamBold text-base text-white">{item.label}</Text>
            <Text className="mt-1 font-gothamLight text-xs leading-4 text-neutral-300">
              {item.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-6">
        <Text className="font-gothamBold text-xl text-white">Spotlight</Text>
        <Text className="mt-1 font-gothamLight text-sm text-neutral-300">
          A few fast lanes into the books and offers your regulars care about.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingTop: 16, paddingRight: 4 }}
      >
        {spotlightItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => openCategory(item.type)}
            className="w-[280px] overflow-hidden rounded-xl bg-white/5"
          >
            <ImageBackground
              source={item.backgroundImage}
              className="h-[170px] justify-between px-4 py-4"
              imageStyle={{ borderRadius: 12 }}
            >
              <View className="rounded-full bg-black/45 px-3 py-1 self-start">
                <Text className="font-gothamMedium text-xs text-white">Store pick</Text>
              </View>

              <View>
                <Image source={item.logo} className="h-16 w-32" resizeMode="contain" />
                <Text className="mt-3 font-gothamBold text-2xl text-white">{item.title}</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mt-6">
        <Text className="font-gothamBold text-xl text-white">Inside the Shop</Text>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-3">
        {storeHighlights.map((item) => (
          <View key={item.label} className="min-w-[48%] flex-1 rounded-xl bg-black/35 px-4 py-4">
            <Text className="font-gothamLight text-xs uppercase tracking-[1px] text-neutral-300">
              {item.label}
            </Text>
            <Text className="mt-2 font-gothamBold text-lg text-white">{item.value}</Text>
          </View>
        ))}
      </View>

      <View className="mt-6 rounded-xl bg-white/10 p-4">
        <Text className="font-gothamBold text-lg text-white">Visit or Connect</Text>
        <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
          Stop by the shop, give the team a call, or follow along for restocks and weekly drops.
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <SecondaryAction
            label="Call"
            onPress={() => openLink("tel:+11234567890")}
            compact
          />
          <SecondaryAction
            label="Email"
            onPress={() => openLink("mailto:contact@duncanvillebookstore.com")}
            compact
          />
          <SecondaryAction
            label="Directions"
            onPress={() =>
              openLink(
                "https://www.google.com/maps/search/?api=1&query=101+W+Camp+Wisdom+Road+Suite+J+Duncanville+TX+75116"
              )
            }
            compact
          />
        </View>

        <View className="mt-4 flex-row items-center gap-3">
          {socialLinks.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => openLink(item.url)}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/10"
            >
              <Image source={item.icon} className="h-5 w-5" resizeMode="contain" />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

function InfoPill({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View className="flex-row items-center rounded-full bg-black/45 px-3 py-2">
      <Ionicons name={icon} size={14} color="#fff" />
      <Text className="ml-2 font-gothamLight text-xs text-white">{text}</Text>
    </View>
  );
}

function PrimaryAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-1 rounded-xl bg-red-600 px-4 py-3">
      <Text className="text-center font-gothamBold text-sm text-white">{label}</Text>
    </Pressable>
  );
}

function SecondaryAction({
  label,
  onPress,
  compact,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl border border-white/20 bg-black/25 px-4 ${
        compact ? "py-2" : "flex-1 py-3"
      }`}
    >
      <Text className="text-center font-gothamMedium text-sm text-white">{label}</Text>
    </Pressable>
  );
}

export default HomeScreen;
