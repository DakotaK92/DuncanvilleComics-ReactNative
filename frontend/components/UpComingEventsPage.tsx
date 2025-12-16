import React from "react";
import { View, FlatList, Text } from "react-native";
import { events, EventTypes } from "../data/events";
import { format } from "date-fns";

const EventsPage = () => {
  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group events by date
  const eventsByDate: { [key: string]: EventTypes[] } = {};
  sortedEvents.forEach((event) => {
    const dateKey = format(new Date(event.date), "yyyy-MM-dd");
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  // Create a list of days with events
  const eventDates = Object.keys(eventsByDate);

  return (
    <FlatList
      data={eventDates}
      keyExtractor={(item) => item}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const dayEvents = eventsByDate[item];
        const displayDate = format(new Date(item), "EEEE, MMMM d");

        return (
          <View className="mb-6">
            {/* Date Header */}
            <Text className="text-lg font-gothamBold mb-2">{displayDate}</Text>

            {/* Events for this date */}
            {dayEvents.map((event) => (
              <View
                key={event.id}
                className="p-4 mb-3 bg-white rounded-xl shadow"
              >
                <Text className="text-lg font-gothamBold">{event.title}</Text>
                <Text className="text-gray-600 font-gothamMedium mt-1">
                  {event.description}
                </Text>
                <Text className="text-gray-500 font-gothamLight mt-2">
                  {event.time}
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
