import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetSlates() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, string, bigint]>>({
    queryKey: ["slates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSlates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSlate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      jsonBlob,
    }: { title: string; jsonBlob: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSlate(title, jsonBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slates"] });
    },
  });
}

export function useDeleteSlate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSlate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slates"] });
    },
  });
}

export function useGetSlate() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getSlate(id);
    },
  });
}
