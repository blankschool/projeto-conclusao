import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "admin_password";

export function useAdminAuth() {
  const [password, setPassword] = useState<string | null>(
    () => sessionStorage.getItem(STORAGE_KEY)
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (pwd: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-db", {
        headers: { "x-admin-password": pwd },
        body: { table: "entrepreneurs", action: "list" },
      });
      if (fnError) throw fnError;
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setPassword(pwd);
    } catch {
      setError("Senha incorreta");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword(null);
  }, []);

  return { isAuthenticated: !!password, password, verify, logout, isVerifying, error };
}
