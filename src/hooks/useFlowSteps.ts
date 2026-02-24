import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFlowSteps() {
  return useQuery({
    queryKey: ["flow_steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flow_steps")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}
