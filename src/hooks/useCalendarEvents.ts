import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface CalendarEvent {
  id: number;
  date: string;
  day: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export function useCalendarEvents() {
  return useQuery({
    queryKey: ["calendar_events"],
    queryFn: async (): Promise<CalendarEvent[]> => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data || [];
    },
  });
}
