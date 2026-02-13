import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface FlowStep {
  id: number;
  step_number: string;
  title: string;
  description: string;
  sort_order: number;
}

export function useFlowSteps() {
  return useQuery({
    queryKey: ["flow_steps"],
    queryFn: async (): Promise<FlowStep[]> => {
      const { data, error } = await supabase
        .from("flow_steps")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data || [];
    },
  });
}
