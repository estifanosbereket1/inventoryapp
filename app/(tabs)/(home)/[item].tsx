import React, { useLayoutEffect } from "react";
import { useGetSingleItem, useDeleteItem } from "@/hooks/useItems";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router, useRouter } from "expo-router";

type ItemScreenRouteProp = RouteProp<{ params: { item: string } }, "params">;

const Index = () => {
  const route = useRoute<ItemScreenRouteProp>();
  const navigation = useNavigation();
  const router = useRouter();
  const { item } = route.params;
  const { data, error, isError, isLoading } = useGetSingleItem(item);
  const { mutate: deleteItem } = useDeleteItem();

  useLayoutEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data.name,
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      });
    }
  }, [data, navigation]);

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteItem({ id: item });
            navigation.goBack();
          } catch (err) {
            Alert.alert("Error", "Failed to delete item. Please try again.");
          }
        },
      },
    ]);
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (isError || error) return <Text>Error fetching item</Text>;

  const handleEdit = () => {
    router.replace(`/(tabs)/(home)/edit/${item}`);
  };

  const imageUrl = `https://inventorybackend-r4jz.onrender.com${data.image}`;
  return (
    <View className="flex-1">
      {/* Image and Icons */}

      <View className="relative w-full h-[60%] bg-blue-600 rounded-b-3xl mb-5">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full rounded-b-3xl"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          onPress={() => handleEdit()}
        >
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute top-4 right-16 bg-white p-2 rounded-full shadow-md"
          onPress={handleDelete}
        >
          <Feather name="trash-2" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center px-4 space-y-4">
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-800">Name:</Text>
          <Text className="text-2xl font-bold mb-2">{data?.name}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-800">Category:</Text>
          <Text className="text-lg text-gray-600">{data?.category}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-800">Price:</Text>
          <Text className="text-xl text-green-600">${data?.price}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-800">Selector:</Text>
          <Text className="text-sm text-blue-600">{data?.selector}</Text>
        </View>
      </View>
    </View>
  );
};

export default Index;
