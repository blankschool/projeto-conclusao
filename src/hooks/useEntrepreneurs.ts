import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEntrepreneurs() {
  return useQuery({
    queryKey: ["entrepreneurs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entrepreneurs")
        .select("*")
        .order("id");
      if (error) throw error;
      return data;
    },
  });
}
