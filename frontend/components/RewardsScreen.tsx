import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type TabKey = "overview" | "earn" | "redeem" | "badges";

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const coins = 1250;

  return (
    <View className="flex-1">

      {/* Tabs */}
      <View className="flex-row mt-4 bg-white rounded-full p-1 mx-4">
        <TabButton
          label="Overview"
          active={activeTab === "overview"}
          onPress={() => setActiveTab("overview")}
        />
        <TabButton
          label="Earn"
          active={activeTab === "earn"}
          onPress={() => setActiveTab("earn")}
        />
        <TabButton
          label="Redeem"
          active={activeTab === "redeem"}
          onPress={() => setActiveTab("redeem")}
        />
        <TabButton
          label="Badges"
          active={activeTab === "badges"}
          onPress={() => setActiveTab("badges")}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "overview" && <Overview coins={coins} />}
        {activeTab === "earn" && <Earn />}
        {activeTab === "redeem" && <Redeem coins={coins} />}
        {activeTab === "badges" && <Badges />}
      </View>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-2 rounded-full ${
        active ? "bg-red-600" : ""
      }`}
    >
      <Text
        className={`text-center font-gothamMedium ${
          active ? "text-white" : "text-black"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Overview({ coins }: { coins: number }) {
  return (
    <View className="p-4">
      <View className="bg-red-600 rounded-2xl p-5 shadow">
        <Text className="text-white text-lg font-gothamMedium">Comic Coins</Text>
        <Text className="text-white text-4xl font-gothamBold">{coins}</Text>

        <View className="mt-3">
          <Text className="text-white text-sm font-gothamLight">
            Next reward: Free Digital Issue
          </Text>
          <View className="h-3 bg-red-600 rounded-full mt-2">
            <View className="h-3 bg-white rounded-full w-3/4" />
          </View>
        </View>
      </View>
    </View>
  );
}

const earnData = [
  { id: "1", icon: "book", label: "Read a Comic", points: 10 },
  { id: "2", icon: "cart", label: "Buy a Comic", points: 50 },
  { id: "3", icon: "calendar", label: "Daily Check-in", points: 5 },
  { id: "4", icon: "qr-code", label: "Scan QR In-Store", points: 25 },
];

function Earn() {
  return (
    <FlatList
      data={earnData}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow">
          <Ionicons name={item.icon as any} size={28} color="red" />
          <View className="ml-4">
            <Text className="text-lg font-gothamMedium">{item.label}</Text>
            <Text className="text-gray-500 font-gothamLight">+{item.points} coins</Text>
          </View>
        </View>
      )}
    />
  );
}

const rewards = [
  { id: "1", title: "Free Digital Issue", cost: 500 },
  { id: "2", title: "$5 Off Purchase", cost: 1000 },
  { id: "3", title: "Exclusive Cover", cost: 1500 },
];

function Redeem({ coins }: { coins: number }) {
  return (
    <FlatList
      data={rewards}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => {
        const unlocked = coins >= item.cost;

        return (
          <View className="flex-1 m-2 bg-white rounded-2xl p-4 shadow">
            <Text className="text-lg font-gothamMedium">{item.title}</Text>
            <Text className="text-gray-500 mb-3 font-gothamLight">{item.cost} coins</Text>

            <Pressable
              disabled={!unlocked}
              className={`rounded-xl py-2 ${
                unlocked ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-center font-semibold">
                {unlocked ? "Redeem" : "Locked"}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

type BadgeType = {
  title: string;
  unlocked: boolean;
};

const BADGES: BadgeType[] = [
  { title: "First Issue", unlocked: true },
  { title: "Collector", unlocked: true },
  { title: "Super Fan", unlocked: false },
  { title: "Variant Hunter", unlocked: false },
  { title: "Event Attendee", unlocked: true },
  { title: "Store Supporter", unlocked: false },
];

function Badges() {
  return (
    <FlatList
      data={BADGES}
      numColumns={3}
      keyExtractor={(item) => item.title}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <View
          className={`flex-1 m-2 rounded-xl p-4 items-center shadow ${
            item.unlocked ? "bg-white" : "bg-gray-300"
          }`}
        >
          <Ionicons
            name="ribbon"
            size={32}
            color={item.unlocked ? "red" : "gray"}
          />
          <Text
            className={`mt-2 text-sm font-gothamMedium text-center ${
              item.unlocked ? "text-black" : "text-gray-500"
            }`}
          >
            {item.title}
          </Text>
        </View>
      )}
    />
  );
}


