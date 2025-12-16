import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { events, EventTypes } from "../data/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EventsPage = () => {
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const filteredEvents = events
  .filter(event => new Date(event.date).getDay() === selectedDay)
  .sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );


  return (
    <View className="flex-1 px-4">
      
      {/* Weekday Tabs */}
      <View className="flex-row justify-between mb-4 mt-2">
        {WEEKDAYS.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(index)}
            className={`px-3 py-2 rounded-full ${
              selectedDay === index
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm font-gothamBold ${
                selectedDay === index
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Text className="text-gray-300 text-center mt-6">
          No events scheduled for this day.
        </Text>
      ) : (
        <FlatList<EventTypes>
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 bg-white rounded-xl shadow">
              <Text className="text-lg font-gothamBold">
                {item.title}
              </Text>
              <Text className="text-gray-600 font-gothamMedium mt-1">
                {item.description}
              </Text>
              <Text className="text-gray-500 font-gothamLight mt-2">
                {item.time}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default EventsPage;
