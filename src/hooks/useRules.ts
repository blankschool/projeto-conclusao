import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Rule {
  id: number;
  text: string;
  sort_order: number;
}

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async (): Promise<Rule[]> => {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data || [];
    },
  });
}
