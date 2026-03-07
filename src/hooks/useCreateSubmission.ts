import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubmissionData {
  entrepreneurId: number;
  userEmail: string;
  link?: string;
  file?: File;
  observations?: string;
}

export function useCreateSubmission() {
  return useMutation({
    mutationFn: async (data: SubmissionData) => {
      let file_url: string | null = null;
      let file_name: string | null = null;

      if (data.file) {
        const timestamp = Date.now();
        const path = `${data.entrepreneurId}/${timestamp}_${data.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("submissions")
          .upload(path, data.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("submissions")
          .getPublicUrl(path);

        file_url = urlData.publicUrl;
        file_name = data.file.name;
      }

      const { error } = await supabase.from("submissions").insert({
        entrepreneur_id: data.entrepreneurId,
        user_email: data.userEmail,
        link: data.link || null,
        file_url,
        file_name,
        observations: data.observations || null,
      });

      if (error) {
        console.error("Submission insert error:", error);
        throw error;
      }
    },
  });
}
