import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { usePostItem } from "@/hooks/useItems";

const schema = yup.object().shape({
  name: yup.string().required("Item name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  category: yup.string().required("Category is required"),
  selector: yup
    .string()
    .oneOf(
      ["for sale", "for use"],
      'Selector must be either "for sale" or "for use"'
    )
    .required("Selector is required"),
});

const Create = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("for sale");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selector: "for sale",
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: undefined,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const { mutate } = usePostItem();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("selector", data.selector);

      if (imageUri) {
        const fileName = imageUri.split("/").pop();
        const fileType = imageUri.split(".").pop();
        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const response = mutate(formData);

      Alert.alert("Success", "Item added successfully!");
      console.log("Item added successfully:", response);

      setValue("name", "");
      setValue("price", 0);
      setValue("category", "");
      setValue("selector", "for sale");
      setImageUri(null);
      router.back();
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "There was a problem adding the item.");
    }
  };

  return (
    <GestureHandlerRootView className="flex-1 p-4 bg-white">
      <ScrollView>
        <Text className="text-2xl font-bold text-blue-600 mb-4">
          Create Item
        </Text>

        <View className="mb-4">
          <Text className="text-lg mb-2">Item Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter item name"
                className="bg-gray-200 p-3 rounded-lg"
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500">{errors.name.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-lg mb-2">Price</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ""}
                placeholder="Enter price"
                keyboardType="numeric"
                className="bg-gray-200 p-3 rounded-lg"
              />
            )}
          />
          {errors.price && (
            <Text className="text-red-500">{errors.price.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-lg mb-2">Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                onValueChange={onChange}
                value={value}
                items={[
                  { label: "Electronics", value: "electronics" },
                  { label: "Furniture", value: "furniture" },
                  { label: "Books", value: "books" },
                  { label: "Clothing", value: "clothing" },
                ]}
                placeholder={{
                  label: "Select a category",
                  value: null,
                }}
                style={{
                  inputIOS: {
                    backgroundColor: "#E5E7EB",
                    padding: 12,
                    borderRadius: 8,
                    color: "black",
                  },
                  inputAndroid: {
                    backgroundColor: "#E5E7EB",
                    padding: 12,
                    borderRadius: 8,
                    color: "black",
                  },
                }}
                useNativeAndroidPickerStyle={false}
              />
            )}
          />
          {errors.category && (
            <Text className="text-red-500">{errors.category.message}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-lg mb-2">Item Status</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ${
                selectedStatus === "for sale" ? "bg-blue-600" : "bg-gray-200"
              } mr-2`}
              onPress={() => {
                setSelectedStatus("for sale");
                setValue("selector", "for sale");
              }}
            >
              <Text
                className={`text-center ${
                  selectedStatus === "for sale" ? "text-white" : "text-black"
                }`}
              >
                For Sale
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg ${
                selectedStatus === "for use" ? "bg-blue-600" : "bg-gray-200"
              }`}
              onPress={() => {
                setSelectedStatus("for use");
                setValue("selector", "for use");
              }}
            >
              <Text
                className={`text-center ${
                  selectedStatus === "for use" ? "text-white" : "text-black"
                }`}
              >
                For Use
              </Text>
            </TouchableOpacity>
          </View>
          {errors.selector && (
            <Text className="text-red-500">{errors.selector.message}</Text>
          )}
        </View>

        <View className="mb-6">
          <TouchableOpacity
            onPress={pickImage}
            className="bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          >
            <AntDesign name="picture" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              Select Image
            </Text>
          </TouchableOpacity>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 100,
                height: 100,
                marginTop: 10,
                borderRadius: 8,
              }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-2">Add Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Create;
