import {
  getItems,
  deleteItem,
  getSingleItem,
  postItem,
  updateItem,
} from "@/api/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export const useGetItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
};

export const useGetSingleItem = (id: any) => {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getSingleItem(id),
  });
};

export const usePostItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: any; update: any }) =>
      updateItem({ id, update }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

// export const useUpdateItem = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, update }: { id: any; update: any }) => {
//       await updateItem({ id, update });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["items"] });
//     },
//   });
// };

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: any }) => {
      await deleteItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });
};
