import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}
