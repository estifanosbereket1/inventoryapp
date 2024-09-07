import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2304bc",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingVertical: 0, // Remove any vertical padding
          margin: 0, // Remove any margin
          height: 60, // Adjust height if necessary
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} color={color} name="home" />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;
