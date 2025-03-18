// app/_layout.tsx
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#E8F5E9",
          borderTopWidth: 1,
          borderTopColor: "#4CAF50",
        },
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTitleStyle: {
          color: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "NgiraInama",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="farming"
        options={{
          title: "Mbarira",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="eco" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
