import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExistingSubmission(entrepreneurId: number, userEmail: string) {
  return useQuery({
    queryKey: ["existing-submission", entrepreneurId, userEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id")
        .eq("entrepreneur_id", entrepreneurId)
        .eq("user_email", userEmail)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!userEmail && !!entrepreneurId,
  });
}
