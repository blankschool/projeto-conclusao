import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConfidentialityAgreement(userEmail: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["confidentiality_agreement", userEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confidentiality_agreements")
        .select("id")
        .eq("user_email", userEmail)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!userEmail,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("confidentiality_agreements")
        .insert({ user_email: userEmail });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["confidentiality_agreement", userEmail], true);
    },
  });

  return {
    hasAccepted: query.data === true,
    isLoading: query.isLoading,
    accept: mutation.mutate,
    isAccepting: mutation.isPending,
  };
}
