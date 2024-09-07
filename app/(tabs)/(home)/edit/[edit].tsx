import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetSingleItem, useUpdateItem } from "@/hooks/useItems";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";

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

type EditScreenRouteProp = RouteProp<{ params: { edit: string } }, "params">;

const Edit = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation();
  const { edit } = route.params;
  const { data, error, isError, isLoading } = useGetSingleItem(edit);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("for sale");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate } = useUpdateItem();

  const imageUrl = `https://inventorybackend-r4jz.onrender.com${data.image}`;

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("price", data.price.toString());
      setValue("category", data.category);
      setValue("selector", data.selector);
      setSelectedStatus(data.selector);
      setImageUri(imageUrl || null);
    }
  }, [data, setValue]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need camera roll permissions!");
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

  const onSubmit = async (formData: any) => {
    try {
      const updatedData = new FormData();

      if (formData.name !== data.name) {
        updatedData.append("name", formData.name);
      }
      if (formData.price !== data.price.toString()) {
        updatedData.append("price", formData.price);
      }
      if (formData.category !== data.category) {
        updatedData.append("category", formData.category);
      }
      if (formData.selector !== data.selector) {
        updatedData.append("selector", formData.selector);
      }

      if (imageUri && imageUri !== data.image) {
        const fileName = imageUri.split("/").pop();
        const fileType = imageUri.split(".").pop();
        updatedData.append("image", {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      mutate({ id: edit, update: updatedData });
      Alert.alert("Success", "Item updated successfully!");

      navigation.goBack();
    } catch (error) {
      console.error("Error updating the item:", error);
      Alert.alert("Error", "There was a problem updating the item.");
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (isError || error) return <Text>Error fetching item</Text>;

  return (
    <View className="flex-1 p-4 bg-white">
      <ScrollView>
        <Text className="text-2xl font-bold text-blue-600 mb-4">Edit Item</Text>

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
            render={({ field: { onChange, onBlur, value } }) => (
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
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-600 p-4 rounded-lg"
        >
          <Text className="text-white text-lg font-bold text-center">
            Update Item
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Edit;
