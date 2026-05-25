import {
  Alert,
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

const spotlightItems = messages.filter((item) => spotlightTypes.includes(item.type));

const HomeScreen = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Link unavailable",
        "We couldn't open that link on this device right now. Please try again in a moment."
      );
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
            <Text className="mt-3 font-gothamLight text-sm leading-5 text-white">
              Keep up with weekly books, manage your pull list, and stay close to what is new in
              the shop.
            </Text>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-2">
            <InfoPill icon="navigate" text="101 W Camp Wisdom Rd, Suite J" />
            <InfoPill icon="time" text="Open daily 10 AM - 7 PM" />
            <InfoPill icon="call" text="Call the shop" />
          </View>

          <View className="mt-auto flex-row gap-3 pt-6">
            <PrimaryAction
              label="Browse Weekly Releases"
              onPress={() => openCategory("weekly-releases")}
            />
            <SecondaryAction 
              label="View Pull List" 
              onPress={() => openCategory("pull-list")} 
            />
          </View>
        </View>
      </ImageBackground>

      <View className="mt-5 rounded-2xl bg-red-600 p-4">
        <SectionHeader
          title="Quick Start"
          subtitle="Jump into the parts of the app you will probably use first."
          light
        />

        <View className="mt-4 flex-row gap-3">
          {quickLinks.map((item) => (
            <Pressable
              key={item.label}
              onPress={() =>
                item.type ? openCategory(item.type) : router.push(item.route as "/rewards")
              }
              style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
              className="min-h-[132px] flex-1 rounded-xl border border-white/10 bg-white/10 p-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15">
                <Ionicons name={item.icon as never} size={18} color="#fff" />
              </View>
              <Text className="mt-4 font-gothamBold text-base text-white">{item.label}</Text>
              <Text className="mt-1 font-gothamLight text-xs leading-4 text-white">
                {item.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-2xl bg-red-600 p-4">
        <SectionHeader
          title="Spotlight"
          subtitle="A few fast lanes into the books and offers that you care about."
          light
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingTop: 16, paddingRight: 4 }}
        >
          {spotlightItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => openCategory(item.type)}
              style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
              className="w-[280px] overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <ImageBackground
                source={item.backgroundImage}
                className="h-[170px] justify-between px-4 py-4"
                imageStyle={{ borderRadius: 12 }}
              >
                <View className="self-start rounded-full bg-black/45 px-3 py-1">
                  <Text className="font-gothamMedium text-xs text-white">Store pick</Text>
                </View>

                <View>
                  <Text className="mt-3 font-gothamBold text-2xl text-white">{item.title}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="mt-6 rounded-xl bg-red-600 p-4">
        <SectionHeader
          title="Visit or Connect"
          subtitle="Stop by the shop, give the team a call, or follow along for restocks and weekly drops."
          light
        />

        <View className="mt-4 flex-row gap-3">
          {[
            { icon: "call" as const, label: "Call", url: "tel:+11234567890" },
            { icon: "mail" as const, label: "Email", url: "mailto:contact@duncanvillebookstore.com" },
            { icon: "navigate" as const, label: "Directions", url: "https://www.google.com/maps/search/?api=1&query=101+W+Camp+Wisdom+Road+Suite+J+Duncanville+TX+75116" },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => openLink(item.url)}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
              className="h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15"
            >
              <Ionicons name={item.icon} size={18} color="#fff" />
            </Pressable>
          ))}
        </View>

        <View className="mt-4 h-px bg-white/15" />

        <View className="mt-4 flex-row gap-3">
          {socialLinks.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => openLink(item.url)}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
              className="h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15"
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      className="flex-1 rounded-xl bg-red-600 px-4 py-3"
    >
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
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      className={`rounded-xl border border-white/15 bg-white/10 px-4 ${
        compact ? "py-2" : "flex-1 py-3"
      }`}
    >
      <Text className="text-center font-gothamMedium text-sm text-white">{label}</Text>
    </Pressable>
  );
}

function SectionHeader({
  title,
  subtitle,
  className = "",
  light,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <View className={className}>
      <View className="self-start">
        <Text className="rounded-full font-gothamBold text-xl text-white">
          {title}
        </Text>
        <View className="mt-2 h-1.5 rounded-full bg-white/90" />
      </View>
      {subtitle ? (
        <Text
          className={`mt-2 font-gothamLight text-sm leading-5 ${
            light ? "text-white" : "text-black"
          }`}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export default HomeScreen;
