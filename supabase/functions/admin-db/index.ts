import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ALLOWED_TABLES = [
  "entrepreneurs",
  "calendar_events",
  "flow_steps",
  "rules",
  "selections",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const password = req.headers.get("x-admin-password");
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { table, action, data, id } = await req.json();

    if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
      return new Response(JSON.stringify({ error: "Invalid table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result;

    switch (action) {
      case "list": {
        const orderCol = ["calendar_events", "flow_steps", "rules"].includes(table)
          ? "sort_order"
          : "id";
        const { data: rows, error } = await supabase
          .from(table)
          .select("*")
          .order(orderCol);
        if (error) throw error;
        result = rows;
        break;
      }
      case "insert": {
        const { data: row, error } = await supabase
          .from(table)
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        result = row;
        break;
      }
      case "update": {
        const { data: row, error } = await supabase
          .from(table)
          .update(data)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        result = row;
        break;
      }
      case "delete": {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
        result = { ok: true };
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
