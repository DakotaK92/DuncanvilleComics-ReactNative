import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser } from '@clerk/clerk-expo';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isPrimaryAdminEmail } from "../../utils/admin";


const TabsLayout = () => {
    const insets = useSafeAreaInsets();
    const { user } = useUser();
    const canSeeAdminTab = isPrimaryAdminEmail(user?.primaryEmailAddress?.emailAddress);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#dc2626",
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
                    title: "Home",
                    tabBarIcon: ({ color, size}) => <FontAwesome name="home" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: "Rewards",
                    tabBarIcon: ({ color, size}) => <FontAwesome5 name="award" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                    tabBarIcon: ({ color, size}) => <Entypo name="ticket" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="comics"
                options={{
                    title: "Comics",
                    tabBarIcon: ({ color, size}) => <Entypo name="book" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="category"
                options={{
                    title: "Store",
                    tabBarIcon: ({ color, size}) => <Ionicons name="layers" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: "Admin",
                    href: canSeeAdminTab ? undefined : null,
                    tabBarIcon: ({ color, size}) => <MaterialIcons name="admin-panel-settings" size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
