import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCreateSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userEmail, entrepreneurId }: { userEmail: string; entrepreneurId: number }) => {
      // Insert selection
      const { error: insertError } = await supabase
        .from("selections")
        .insert({ user_email: userEmail, entrepreneur_id: entrepreneurId });
      if (insertError) throw insertError;

      // Increment taken
      const { data: ent, error: fetchError } = await supabase
        .from("entrepreneurs")
        .select("taken")
        .eq("id", entrepreneurId)
        .maybeSingle();
      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("entrepreneurs")
        .update({ taken: (ent?.taken ?? 0) + 1 })
        .eq("id", entrepreneurId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
      queryClient.invalidateQueries({ queryKey: ["selections"] });
    },
  });
}
