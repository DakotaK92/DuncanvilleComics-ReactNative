import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ThisWeekTab from "./ThisWeekTab";
import NextWeekTab from "./NextWeekTab";
import ComingSoonTab from "./ComingSoonTab";

const Tab = createMaterialTopTabNavigator();

export default function CategoryTabs({ categoryType }: { categoryType: string }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="This Week"
        component={ThisWeekTab}
        initialParams={{ categoryType }}
      />
      <Tab.Screen
        name="Next Week"
        component={NextWeekTab}
        initialParams={{ categoryType }}
      />
      <Tab.Screen
        name="Coming Soon"
        component={ComingSoonTab}
        initialParams={{ categoryType }}
      />
    </Tab.Navigator>
  );
}
