import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, Feather } from "@expo/vector-icons";
import Categories from "@/components/Categories";
import { useGetItems } from "@/hooks/useItems";
import { useRouter } from "expo-router";

const extractCategories = (data: any) => {
  const categoryCounts = data.reduce((acc: any, item: any) => {
    const normalizedCategory = item.category.toLowerCase();
    acc[normalizedCategory] = (acc[normalizedCategory] || 0) + 1;
    return acc;
  }, {});

  const categoriesArray = Object.keys(categoryCounts).map((category) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count: categoryCounts[category],
  }));

  return [{ category: "All", count: data.length }, ...categoriesArray];
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: items, isLoading, isError, error } = useGetItems();

  console.log(items);

  const categories = extractCategories(items || []);

  const filteredItems = items?.filter((item: any) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const router = useRouter();

  const ItemCard = ({ item }: { item: any }) => {
    const imageUrl = `https://inventorybackend-r4jz.onrender.com${item.image}`;
    return (
      <View className="bg-white rounded-lg p-3 m-2 w-[45%] border-gray-200 shadow-md">
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/(home)/${item.id}`)}
        >
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-28 rounded-lg"
            resizeMode="cover"
            onError={(error) => console.log("Image loading error: ", error)}
          />
          <Text className="mt-2 text-lg font-bold">{item.name}</Text>
          <Text className="text-gray-500">{item.category}</Text>
          <Text className="mt-1 text-green-600 font-bold">${item.price}</Text>
          <Text className="text-sm text-blue-600">{item.selector}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <View className="bg-blue-600 h-[30%] rounded-b-3xl p-5">
          <View className="mt-8 flex flex-col justify-start items-start">
            <Text className="text-2xl text-white font-bold">
              Inventory Items
            </Text>
            <View className="relative mt-4 w-full">
              <TextInput
                placeholder="Search items"
                value={search}
                onChangeText={(text) => setSearch(text)}
                className="bg-white rounded-full pl-10 pr-4 py-2 text-black border-0 focus:border-transparent focus:outline-none"
              />
              <Feather
                name="search"
                size={20}
                color="#000"
                style={styles.icon}
              />
            </View>
          </View>
        </View>

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View className="flex-1 mt-4">
          {filteredItems && filteredItems.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg text-gray-500">No items found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={({ item }) => <ItemCard item={item} />}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <TouchableOpacity
          className="absolute bottom-8 right-8 bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          onPress={() => router.push("/create")}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});

export default Index;
