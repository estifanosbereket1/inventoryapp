import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";

export const extractCategories = (data: any) => {
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

const Categories = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: any;
  selectedCategory: any;
  onSelectCategory: any;
}) => {
  return (
    <View className="p-5">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row">
          {categories.map((categoryItem: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectCategory(categoryItem.category)}
              className={`p-3 rounded-xl mx-2 ${
                selectedCategory === categoryItem.category
                  ? "bg-blue-700"
                  : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-base ${
                  selectedCategory === categoryItem.category
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {categoryItem.category} ({categoryItem.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;
