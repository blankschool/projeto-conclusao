import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Entrepreneur {
  id: number;
  name: string;
  company: string;
  segment: string;
  slots: number;
  avatar: string;
  bio: string;
  taken: number;
  full_bio?: string;
  instagram_url?: string;
  linkedin_url?: string;
  website_url?: string;
  content_guidelines?: string;
  content_examples?: string[];
  instagram_followers?: number;
}

export function useEntrepreneurs() {
  return useQuery({
    queryKey: ["entrepreneurs"],
    queryFn: async (): Promise<Entrepreneur[]> => {
      const { data: entrepreneurs, error: entError } = await supabase
        .from("entrepreneurs")
        .select("*")
        .order("id");

      if (entError) throw entError;

      const { data: selections, error: selError } = await supabase
        .from("selections")
        .select("entrepreneur_id");

      if (selError) throw selError;

      const countMap: Record<number, number> = {};
      selections?.forEach((s) => {
        countMap[s.entrepreneur_id] = (countMap[s.entrepreneur_id] || 0) + 1;
      });

      return (entrepreneurs || []).map((ent) => ({
        ...ent,
        taken: countMap[ent.id] || 0,
      }));
    },
  });
}

export function useCreateSelection() {
  const queryClient = useQueryClient();

  return async (email: string, entrepreneurId: number) => {
    const { error } = await supabase
      .from("selections")
      .insert({ email, entrepreneur_id: entrepreneurId });

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
  };
}
