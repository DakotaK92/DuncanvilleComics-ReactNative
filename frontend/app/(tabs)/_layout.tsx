import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const TabsLayout = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "red",
                tabBarInactiveTintColor: "#808080",
                tabBarStyle: {
                    backgroundColor: "#f8f8f8",
                    borderTopWidth: 1,
                    borderTopColor: "#e5e5e5",
                    height: 50 + insets.bottom,
                    paddingTop: 5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size}) => <FontAwesome name="home" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size}) => <FontAwesome5 name="award" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size}) => <Entypo name="ticket" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="comics"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size}) => <Entypo name="book" size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout