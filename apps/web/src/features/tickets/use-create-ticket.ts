import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useCreateTicket() {
  return useMutation({
    mutationFn: (data: { title: string; description: string; authorId: string }) => 
      api.createTicket(data),
  });
}