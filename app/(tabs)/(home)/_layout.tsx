import { Stack } from "expo-router";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[item]" options={{ headerShown: true }} />
    </Stack>
  );
};

export default HomeLayout;
