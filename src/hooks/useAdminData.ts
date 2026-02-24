import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function adminRequest(password: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("admin-db", {
    headers: { "x-admin-password": password },
    body,
  });
  if (error) throw error;
  return data;
}

export function useAdminList(table: string, password: string | null) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: () => adminRequest(password!, { table, action: "list" }),
    enabled: !!password,
  });
}

export function useAdminMutation(table: string, password: string | null) {
  const qc = useQueryClient();

  const insert = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      adminRequest(password!, { table, action: "insert", data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      adminRequest(password!, { table, action: "update", id, data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      adminRequest(password!, { table, action: "delete", id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  return { insert, update, remove };
}
