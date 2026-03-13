import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SubmissionData {
  id: number;
  feedback: string | null;
  status: string | null;
}

export function useExistingSubmission(entrepreneurId: number, userEmail: string) {
  return useQuery({
    queryKey: ["existing-submission", entrepreneurId, userEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, feedback, status")
        .eq("entrepreneur_id", entrepreneurId)
        .eq("user_email", userEmail)
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        return data[0] as SubmissionData;
      }
      return null;
    },
    enabled: !!userEmail && !!entrepreneurId,
  });
}
