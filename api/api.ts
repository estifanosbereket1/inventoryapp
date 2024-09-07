import axios from "axios";

const api = axios.create({
  baseURL: "https://inventorybackend-r4jz.onrender.com/api",
});

export const getItems = async () => {
  try {
    const response = await api.get("/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getSingleItem = async (id: any) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const postItem = async (data: FormData) => {
  try {
    console.log(data);
    const response = await api.post("/items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting item:", error);
    throw error;
  }
};

// export const updateItem = async ({ id, update }: { id: any; update: any }) => {
//   try {
//     const response = await api.patch(`/items/${id}`, update, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error posting item:", error);
//     throw error;
//   }
// };

export const updateItem = async ({ id, update }: { id: any; update: any }) => {
  try {
    console.log("Updating item with data:", update);
    console.log(await getSingleItem(id));

    const response = await api.patch(`/items/${id}`, update, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Update response:", response);
    return response.data;
  } catch (error) {
    console.error("Error Updating item:", error);
    throw error;
  }
};

export const deleteItem = async (id: any) => {
  await api.delete(`/items/${id}`);
};
