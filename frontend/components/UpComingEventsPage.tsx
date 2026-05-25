import React from "react";
import { View, FlatList, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { events, EventTypes } from "../data/events";
import { format } from "date-fns";

const EventsPage = () => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const eventsByDate: { [key: string]: EventTypes[] } = {};
  sortedEvents.forEach((event) => {
    const dateKey = format(new Date(event.date), "yyyy-MM-dd");
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  const eventDates = Object.keys(eventsByDate);

  return (
    <FlatList
      data={eventDates}
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      ListHeaderComponent={
        <View className="pb-5">
          <View className="rounded-2xl bg-red-600 px-5 py-5">
            <View className="self-start">
              <Text className="font-gothamBold text-2xl text-white">Upcoming Events</Text>
              <View className="mt-2 h-1.5 rounded-full bg-white/90" />
            </View>
            <Text className="mt-3 font-gothamLight text-sm leading-5 text-red-100">
              Games, leagues, and open play happening at the shop this week.
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const dayEvents = eventsByDate[item];
        const displayDate = format(new Date(item), "EEEE, MMMM d");

        return (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center gap-3">
              <Text className="font-gothamBold text-base text-neutral-900">{displayDate}</Text>
              <View className="h-px flex-1 bg-black" />
            </View>

            {dayEvents.map((event) => (
              <View key={event.id} className="mb-3 rounded-2xl bg-white p-4 shadow">
                <View className="flex-row items-start justify-between gap-3">
                  <Text className="flex-1 font-gothamBold text-base text-neutral-900">
                    {event.title}
                  </Text>
                  <View className="flex-row items-center rounded-full bg-red-50 px-2.5 py-1">
                    <Ionicons name="time-outline" size={11} color="#b91c1c" />
                    <Text className="ml-1 font-gothamMedium text-xs text-red-700">
                      {event.time}
                    </Text>
                  </View>
                </View>
                <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-600">
                  {event.description}
                </Text>
              </View>
            ))}
          </View>
        );
      }}
    />
  );
};

export default EventsPage;
